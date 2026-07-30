from __future__ import annotations

import csv
import os
from dataclasses import dataclass
from pathlib import Path

from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware

BASE_DIR = Path(__file__).resolve().parent
QUESTIONS_FILE = BASE_DIR / "questions.csv"

app = FastAPI(title="Pokémon Skin Battle Quiz")
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SESSION_SECRET", "change-this-secret-before-deployment"),
    same_site="lax",
    https_only=False,  # Set to True when the app is served over HTTPS.
)

templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))


class QuestionFileError(ValueError):
    """Raised when questions.csv is missing or contains invalid data."""


@dataclass(frozen=True)
class Question:
    id: str
    text: str
    options: dict[str, str]
    correct_option: str
    explanation: str


REQUIRED_COLUMNS = {
    "id",
    "question",
    "option_a",
    "option_b",
    "option_c",
    "option_d",
    "correct_option",
    "explanation",
}


def load_questions() -> list[Question]:
    """Load and validate the CSV each time so edits appear immediately."""
    if not QUESTIONS_FILE.exists():
        raise QuestionFileError(f"Question file not found: {QUESTIONS_FILE.name}")

    with QUESTIONS_FILE.open("r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)
        headers = set(reader.fieldnames or [])
        missing = REQUIRED_COLUMNS - headers
        if missing:
            raise QuestionFileError(
                "questions.csv is missing column(s): " + ", ".join(sorted(missing))
            )

        questions: list[Question] = []
        seen_ids: set[str] = set()

        for row_number, row in enumerate(reader, start=2):
            question_id = (row.get("id") or "").strip()
            text = (row.get("question") or "").strip()
            correct_option = (row.get("correct_option") or "").strip().upper()
            explanation = (row.get("explanation") or "").strip()
            options = {
                "A": (row.get("option_a") or "").strip(),
                "B": (row.get("option_b") or "").strip(),
                "C": (row.get("option_c") or "").strip(),
                "D": (row.get("option_d") or "").strip(),
            }

            if not question_id:
                raise QuestionFileError(f"Row {row_number}: id cannot be empty.")
            if question_id in seen_ids:
                raise QuestionFileError(
                    f"Row {row_number}: duplicate id '{question_id}'."
                )
            if not text:
                raise QuestionFileError(f"Row {row_number}: question cannot be empty.")
            if any(not option_text for option_text in options.values()):
                raise QuestionFileError(
                    f"Row {row_number}: all four answer options are required."
                )
            if correct_option not in options:
                raise QuestionFileError(
                    f"Row {row_number}: correct_option must be A, B, C, or D."
                )

            seen_ids.add(question_id)
            questions.append(
                Question(
                    id=question_id,
                    text=text,
                    options=options,
                    correct_option=correct_option,
                    explanation=explanation,
                )
            )

    if not questions:
        raise QuestionFileError("questions.csv must contain at least one question.")

    return questions


def reset_game(request: Request) -> None:
    request.session.clear()
    request.session.update(
        {
            "question_index": 0,
            "score": 0,
            "answered_correctly": False,
            "result": None,
        }
    )


def ensure_game_state(request: Request, question_count: int) -> None:
    required_keys = {"question_index", "score", "answered_correctly", "result"}
    if not required_keys.issubset(request.session):
        reset_game(request)
        return

    question_index = request.session.get("question_index", 0)
    if not isinstance(question_index, int) or question_index < 0:
        reset_game(request)
        return

    # If the CSV was shortened while a game was active, start a fresh game.
    if question_index > question_count:
        reset_game(request)


def render_page(request: Request) -> HTMLResponse:
    try:
        questions = load_questions()
    except QuestionFileError as exc:
        return templates.TemplateResponse(
            request=request,
            name="index.html",
            context={
                "page_title": "Pokémon Skin Battle Quiz",
                "csv_error": str(exc),
                "complete": False,
                "question": None,
            },
            status_code=500,
        )

    ensure_game_state(request, len(questions))

    question_index = int(request.session["question_index"])
    score = int(request.session["score"])
    complete = question_index >= len(questions)

    question = None if complete else questions[question_index]
    enemy_health = max(0, round(100 - (score / len(questions) * 100)))
    progress = 100 if complete else round((question_index / len(questions)) * 100)

    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={
            "page_title": "Pokémon Skin Battle Quiz",
            "csv_error": None,
            "complete": complete,
            "question": question,
            "question_number": question_index + 1,
            "question_count": len(questions),
            "score": score,
            "result": request.session.get("result"),
            "answered_correctly": request.session.get("answered_correctly", False),
            "enemy_health": enemy_health,
            "progress": progress,
        },
    )


@app.get("/", response_class=HTMLResponse)
async def home(request: Request) -> HTMLResponse:
    return render_page(request)


@app.post("/", response_class=HTMLResponse)
async def play(
    request: Request,
    action: str = Form("answer"),
    selected_answer: str | None = Form(None),
) -> RedirectResponse:
    try:
        questions = load_questions()
    except QuestionFileError:
        return RedirectResponse(url="/", status_code=303)

    ensure_game_state(request, len(questions))
    action = action.strip().lower()

    if action == "restart":
        reset_game(request)
        return RedirectResponse(url="/", status_code=303)

    question_index = int(request.session["question_index"])

    if action == "next":
        if request.session.get("answered_correctly") and question_index < len(questions):
            request.session["question_index"] = question_index + 1
            request.session["answered_correctly"] = False
            request.session["result"] = None
        return RedirectResponse(url="/", status_code=303)

    if action == "retry":
        request.session["answered_correctly"] = False
        request.session["result"] = None
        return RedirectResponse(url="/", status_code=303)

    if question_index >= len(questions):
        return RedirectResponse(url="/", status_code=303)

    question = questions[question_index]
    answer = (selected_answer or "").strip().upper()

    if answer not in question.options:
        request.session["result"] = {
            "correct": False,
            "title": "Choose an answer first!",
            "message": "Select one of the four choices, then launch your attack.",
            "selected": None,
            "correct_option": question.correct_option,
            "explanation": "",
        }
    elif answer == question.correct_option:
        if not request.session.get("answered_correctly"):
            request.session["score"] = int(request.session["score"]) + 1
        request.session["answered_correctly"] = True
        request.session["result"] = {
            "correct": True,
            "title": "Super effective!",
            "message": "Correct! Your Pokémon wins this battle round.",
            "selected": answer,
            "correct_option": question.correct_option,
            "explanation": question.explanation,
        }
    else:
        request.session["answered_correctly"] = False
        request.session["result"] = {
            "correct": False,
            "title": "The attack missed!",
            "message": "That answer is not correct. Recharge and try again.",
            "selected": answer,
            "correct_option": question.correct_option,
            "explanation": "",
        }

    return RedirectResponse(url="/", status_code=303)
