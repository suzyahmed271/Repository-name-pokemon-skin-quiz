# Animal Cell Interactive Systems Lab

An English-language classroom simulation for middle-school students. Students inspect an animal cell, change environmental and organelle-function variables, observe live system indicators, save and compare trials, and diagnose a hidden cell problem.

## Scientific model

This is a simplified conceptual model, not a quantitative model of a real cell. Environmental inputs use interpretable classroom units; ATP availability, protein production, transport, cell volume, and the explicitly named model health score are estimates, not laboratory readings. Waste is shown as a relative index. The model focuses on these relationships:

- Oxygen saturation (%) and glucose concentration (0–10 mM), together with mitochondrial function, affect ATP availability (% of the healthy baseline).
- Nucleus signaling and ribosome function affect protein production; rough ER, vesicles, Golgi, and the membrane are shown as a connected processing and transport pathway.
- Lysosome function affects waste buildup.
- Outside-solution osmolarity (250–350 mOsm/L) and membrane transport efficiency affect cell volume (% of its baseline), water movement, and internal balance.
- Temperature (30–42 °C) and pH (6.5–8.0) affect simplified process performance and cell stress. Reference healthy settings are 37 °C, pH 7.4, and 300 mOsm/L.

The nucleus is described as containing DNA; RNA messages carry instructions to ribosomes. The simulation does not show DNA itself moving to ribosomes. Animal-cell vacuoles are shown as small storage structures. The centrosome is an organizer, not a membrane-bound organelle. Cell division and detailed biochemical reactions are outside the model.

## Student modes

- **Cell Survival Challenge (project-based learning):** begin with one of five mystery-cell cases, inspect cell parts, ask a testable question, run controlled experiments, compare saved trials, propose a diagnosis, test a rescue, and create/present a report, poster, systems presentation, or cell-health protocol.
- **Learn:** select any of 14 structures for its role, connections, and a simplified failure effect; optional speech reads the description aloud.
- **Explore:** choose one of ten environmental or cell-system inputs, predict an outcome, run a fair test, wait for the modeled response, and compare baseline with the result. Previewed slider values do not affect the cell until the experiment is run.
- **What Happens If?:** predict an outcome, run a preset test, wait for its modeled response, compare the result with the prediction, then adjust variables for follow-up trials.
- **Rescue the Cell:** diagnose a hidden energy, waste, export, transport, or instruction problem using data and organelle behavior; adjust a suspected cause and test the recovery.

## Variables and live evidence

Student Explore controls include oxygen saturation, glucose concentration, outside-solution osmolarity, temperature, pH, mitochondrial, ribosome, Golgi, and lysosome function, and membrane transport efficiency. Scientific inputs use their stated physical ranges and units; organelle and membrane efficiencies are labeled as model-function levels (100% = normal). Sliders show endpoints, the current value, and a healthy reference marker.

The measurement view emphasizes the selected input, its direct modeled output, and a Stable / Stressed / Critical status. A separate trial plot has labeled axes, units, and one point for each saved run of the same variable. Up to five recent runs are listed together for comparison. During an experiment, only the relevant energy, protein, waste, transport, or osmosis pathway animates; the membrane changes size with modeled volume.

The notebook stores question, prediction, independent variable and value, dependent output before and after the test, observation, saved settings, and a structured claim-evidence-reasoning response. Resetting cell conditions preserves saved trials; Reset All clears the session.

The Cell Survival Challenge includes nine visible project milestones, a rotating five-role team, teacher settings for trial count, product, support, hints, and rescue criteria, plus a project notebook, trial comparison, rubric, and print-to-PDF report view. Diagnosis is gated on the required saved trials and comparison of at least two trials. Rescue success follows the teacher-selected live-indicator criterion. Percentages remain simplified relative indicators, not measurements from real cells.

Adaptive guidance responds to prediction performance: repeated difficulty surfaces a hint; successful evidence-based predictions gradually move from guided support to more independent inquiry. Teacher Mode can toggle hints, choose challenge complexity, and include or exclude variables and structures.

## Build and run

The GitHub Actions workflow builds the PhET `adapted-from-phet` version and publishes a ZIP artifact containing `index.html` and this guide.

1. Open the latest successful **Build Animal Cell PhET Adaptation** workflow run.
2. Download and extract the `animal-cell-phet-adapted` artifact.
3. Open `index.html` in a current desktop browser. The built HTML is intended to run locally without a development server; verify the downloaded build in the target classroom browser before teaching.

The same HTML is the browser-based version and the standalone offline deliverable. To make it available online to a class, upload the built HTML to the school’s approved static web host or LMS. This repository workflow creates the artifact; it does not itself publish a public website.

## Development

The source is an overlay for `phetsims/gene-expression-essentials`. The workflow clones the PhET dependencies, overlays `animal-cell-phet-overlay/js`, runs the PhET adapted-brand build, and uploads the resulting HTML. Preserve PhET lint conventions and attribution when changing the simulation.
