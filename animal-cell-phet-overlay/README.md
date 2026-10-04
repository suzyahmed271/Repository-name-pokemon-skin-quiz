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

## Student experience

The student view is one focused Explore screen: a short organelle explanation on the left, the clickable animal cell in the center, and one organelle test and live result panel on the right. Selecting a structure highlights it and its relevant pathway; unrelated structures dim. Functional parts expose one corresponding function slider. Context structures explain their role without suggesting an unrelated control.

## Variables and live evidence

Explore controls adjust one selected organelle's corresponding model-function level (100% = normal). A run snapshots the current readings, then the simplified cell model responds over time. The panel compares before and live values for ATP, protein production, waste burden, and cell health. Reset to Healthy Cell restores baseline inputs while the outputs recover gradually. The colored cell particles and highlighted pathway represent the selected process; all values are conceptual indicators, not measurements from real cells.

## Build and run

The GitHub Actions workflow builds the PhET `adapted-from-phet` version and publishes a ZIP artifact containing `index.html` and this guide.

1. Open the latest successful **Build Animal Cell PhET Adaptation** workflow run.
2. Download and extract the `animal-cell-phet-adapted` artifact.
3. Open `index.html` in a current desktop browser. The built HTML is intended to run locally without a development server; verify the downloaded build in the target classroom browser before teaching.

The same HTML is the browser-based version and the standalone offline deliverable. To make it available online to a class, upload the built HTML to the school’s approved static web host or LMS. This repository workflow creates the artifact; it does not itself publish a public website.

## Development

The source is an overlay for `phetsims/gene-expression-essentials`. The workflow clones the PhET dependencies, overlays `animal-cell-phet-overlay/js`, runs the PhET adapted-brand build, and uploads the resulting HTML. Preserve PhET lint conventions and attribution when changing the simulation.
