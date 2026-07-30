# Pokémon Skin Battle Quiz

A small FastAPI web game for Grade 9 skin-structure questions. Students choose one of four answers. A correct answer makes their Pokémon win the round; a wrong answer lets them retry.

## Project files

```text
pokemon_skin_quiz/
├── app.py
├── questions.csv
├── requirements.txt
└── templates/
    └── index.html
```

## Run the application

Python 3.10 or newer is recommended.

### 1. Create and activate a virtual environment

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

macOS or Linux:

```bash
source .venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Start the development server

```bash
fastapi dev app.py
```

Open the address shown in the terminal, normally:

```text
http://127.0.0.1:8000
```

You can also run it with Uvicorn:

```bash
uvicorn app:app --reload
```

## Add more questions

Open `questions.csv` in a text editor or spreadsheet program and add one row per question.

Required columns:

| Column | Meaning |
|---|---|
| `id` | A unique value for the question |
| `question` | The question shown to the student |
| `option_a` | Choice A |
| `option_b` | Choice B |
| `option_c` | Choice C |
| `option_d` | Choice D |
| `correct_option` | `A`, `B`, `C`, or `D` |
| `explanation` | Message shown after a correct answer |

Example row:

```csv
3,What gives skin its color?,Sweat,Melanin,Water,Oil,B,Melanin is the pigment that contributes to skin color.
```

If a field contains a comma, surround that field with double quotes. The app reloads the CSV for each request, so saved changes are available immediately. Restart the current game in the browser after adding or removing questions.

## Deployment note

For a deployed version, set a strong session secret and enable secure cookies:

```bash
export SESSION_SECRET="replace-with-a-long-random-secret"
```

Then change `https_only=False` to `https_only=True` in `app.py` after HTTPS is configured.
