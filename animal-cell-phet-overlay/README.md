# Animal Cell Interactive Systems Lab

An English-language classroom simulation for middle-school students. Students inspect an animal cell, change environmental and organelle-function variables, observe live system indicators, save and compare trials, and diagnose a hidden cell problem.

## Scientific model

This is a simplified conceptual model, not a quantitative model of a real cell. Percentages are relative indicators, not measured biological values. The model focuses on these relationships:

- Oxygen and glucose availability plus mitochondria function affect the relative ATP/usable-energy indicator.
- Nucleus signaling and ribosome function affect protein production; rough ER, vesicles, Golgi, and the membrane are shown as a connected processing and transport pathway.
- Lysosome function affects waste buildup.
- Water level and membrane permeability affect relative cell volume and internal balance.
- Temperature, pH, and toxin exposure affect simplified process-performance and stress indicators.

The nucleus is described as containing DNA; RNA messages carry instructions to ribosomes. The simulation does not show DNA itself moving to ribosomes. Animal-cell vacuoles are shown as small storage structures. The centrosome is an organizer, not a membrane-bound organelle. Cell division and detailed biochemical reactions are outside the model.

## Student modes

- **Learn:** select any of 14 structures for its role, connections, and a simplified failure effect; optional speech reads the description aloud.
- **Explore:** use sliders and live evidence to design a fair test, start a baseline snapshot, and record trials.
- **What Happens If?:** predict an outcome, run one of ten preset tests, compare the result with the prediction, then adjust variables for follow-up trials.
- **Rescue the Cell:** diagnose a hidden energy, waste, export, transport, or instruction problem using data and organelle behavior; adjust a suspected cause and test the recovery.

## Variables and live evidence

Environment controls include oxygen, glucose, outside water, temperature, pH, toxin exposure, protein demand, and membrane permeability. Organelle controls include mitochondria, ribosome, Golgi, lysosome, and nucleus-signaling function. Controls use keyboard- and touch-friendly sliders in 5-point steps.

Live indicators show relative ATP/energy, protein production, waste buildup, cell volume, internal balance, cell health, protein export, membrane transport, and stress. Animated particles illustrate protein transport, energy activity, and waste movement. The membrane responds visually to relative volume and stress.

The notebook stores question, prediction, independent variable and value, dependent output before and after the test, observation, saved settings, and a structured claim-evidence-reasoning response. Resetting cell conditions preserves saved trials; Reset All clears the session.

Adaptive guidance responds to prediction performance: repeated difficulty surfaces a hint; successful evidence-based predictions gradually move from guided support to more independent inquiry. Teacher Mode can toggle hints, choose challenge complexity, and include or exclude variables and structures.

## Build and run

The GitHub Actions workflow builds the PhET `adapted-from-phet` version and publishes a ZIP artifact containing `index.html` and this guide.

1. Open the latest successful **Build Animal Cell PhET Adaptation** workflow run.
2. Download and extract the `animal-cell-phet-adapted` artifact.
3. Open `index.html` in a current desktop browser. The built HTML is intended to run locally without a development server; verify the downloaded build in the target classroom browser before teaching.

The same HTML is the browser-based version and the standalone offline deliverable. To make it available online to a class, upload the built HTML to the school’s approved static web host or LMS. This repository workflow creates the artifact; it does not itself publish a public website.

## Development

The source is an overlay for `phetsims/gene-expression-essentials`. The workflow clones the PhET dependencies, overlays `animal-cell-phet-overlay/js`, runs the PhET adapted-brand build, and uploads the resulting HTML. Preserve PhET lint conventions and attribution when changing the simulation.
