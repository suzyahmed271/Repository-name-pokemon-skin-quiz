# Animal Cell Interactive Systems Lab

An English-language classroom simulation for middle-school students. Students inspect an animal cell, change environmental and organelle-function variables, observe live system indicators, save and compare trials, and diagnose a hidden cell problem.

## Scientific model

This is a simplified conceptual model, not a quantitative model of a real cell. Environmental inputs use interpretable classroom units; ATP availability, protein production, transport, cell volume, and the explicitly named model health score are estimates, not laboratory readings. Waste is shown as a relative index. The model focuses on these relationships:

- Oxygen saturation (%) and glucose concentration (0–10 mM), together with mitochondrial function, affect ATP availability (% of the healthy baseline).
- Nucleus signaling and ribosome function affect protein production; rough ER, vesicles, Golgi, and the membrane are shown as a connected processing and transport pathway.
- Lysosome function affects waste buildup.
- Outside-solution osmolarity (200–400 mOsm/L) and membrane permeability (0–200% of normal) affect cell volume (% of its baseline), water movement, selective transport, and internal balance. Low osmolarity drives water inward and swelling; high osmolarity drives water outward and shrinking.
- Temperature (30–42 °C) and pH (6.4–8.4) affect simplified process performance and cell stress. Reference healthy settings are 37 °C, pH 7.4, and 300 mOsm/L.
- Phenotype labels summarize the evolving indicators as healthy, stressed, swollen, shrunken, or critical. They are teaching states, not diagnoses of real cells.

The nucleus is described as containing DNA; RNA messages carry instructions to ribosomes. The simulation does not show DNA itself moving to ribosomes. Animal-cell vacuoles are shown as small storage structures. The centrosome is an organizer, not a membrane-bound organelle. Cell division and detailed biochemical reactions are outside the model.

## Student experience

The student view keeps one focused Explore screen: the clickable animal cell is centered, with its cell-parts explanation on the left and the variable selector, prediction, experiment control, and live readings on the right. The selector exposes pH, temperature, osmolarity, permeability, oxygen, glucose, and mitochondrial, ribosome, Golgi, or lysosome function. The cell's volume, membrane appearance, organelle activity, and pathway particles respond to the model outputs; students see a cause-and-effect summary after running a trial.

## Variables and live evidence

Explore controls adjust one selected environmental condition or organelle-function level (100% = normal function). A run snapshots the current readings, then the simplified cell model responds over time. The panel compares before and live values for outputs connected to the selected input. Reset to Healthy Cell restores baseline inputs while outputs recover gradually. For example, reducing mitochondrial function reduces ATP first; cell activity and health respond downstream. Osmolarity tests at 220 and 380 mOsm/L show swelling and shrinking respectively, while pH 6.5 lowers process performance compared with pH 7.4. The colored particles, membrane appearance, and highlighted pathway represent the selected process; all values are conceptual indicators, not measurements from real cells.

## Build and run

The GitHub Actions workflow builds the PhET `adapted-from-phet` version and publishes a ZIP artifact containing `index.html` and this guide.

1. Open the latest successful **Build Animal Cell PhET Adaptation** workflow run.
2. Download and extract the `animal-cell-phet-adapted` artifact.
3. Open `index.html` in a current desktop browser. The built HTML is intended to run locally without a development server; verify the downloaded build in the target classroom browser before teaching.

The same HTML is the browser-based version and the standalone offline deliverable. To make it available online to a class, upload the built HTML to the school’s approved static web host or LMS. This repository workflow creates the artifact; it does not itself publish a public website.

## Development

The source is an overlay for `phetsims/gene-expression-essentials`. The workflow clones the PhET dependencies, overlays `animal-cell-phet-overlay/js`, runs the PhET adapted-brand build, and uploads the resulting HTML. Preserve PhET lint conventions and attribution when changing the simulation.
