// Copyright 2015-2026, University of Colorado Boulder

/**
 * Simplified, classroom-scale cause-and-effect model for Animal Cell Systems Lab.
 * Environmental controls use interpretable classroom units; biological outputs are simplified model estimates.
 *
 * @author Suzan Ahmed Mustafa
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import Range from '../../../dot/js/Range.js';

const clamp = value => Math.max( 0, Math.min( 100, value ) );

const VARIABLE_DEFINITIONS = [
  { key: 'oxygen', label: 'Oxygen saturation', group: 'environment', value: 100, min: 0, max: 100, step: 5, unit: '% saturation', output: 'ATP availability', outputKey: 'atp', visible: 'Energy particles slow when oxygen is limited.' },
  { key: 'glucose', label: 'Glucose concentration', group: 'environment', value: 5, min: 0, max: 10, step: 0.5, unit: 'mM', output: 'ATP availability', outputKey: 'atp', visible: 'Energy supply changes as fuel availability changes.' },
  { key: 'water', label: 'Outside osmolarity', group: 'environment', value: 300, min: 200, max: 400, step: 10, unit: 'mOsm/L', output: 'Relative cell volume', outputKey: 'volume', visible: 'Water movement changes cell volume.' },
  { key: 'temperature', label: 'Temperature', group: 'environment', value: 37, min: 30, max: 42, step: 0.5, unit: '°C', output: 'Cell process rate', outputKey: 'health', visible: 'Temperatures outside the healthy range reduce process performance.' },
  { key: 'ph', label: 'pH', group: 'environment', value: 7.4, min: 6.4, max: 8.4, step: 0.1, unit: '', output: 'Cell process rate', outputKey: 'health', visible: 'Conditions far from the preferred range add stress.' },
  { key: 'toxins', label: 'Toxin exposure', group: 'conditions', value: 0, min: 0, max: 100, step: 5, unit: '% model exposure scale', output: 'Cell health / stress', outputKey: 'health', visible: 'Stress marks appear as exposure increases.' },
  { key: 'proteinDemand', label: 'Protein demand', group: 'conditions', value: 55, min: 0, max: 100, step: 5, unit: '% model setting', output: 'Protein output / backlog', outputKey: 'protein', visible: 'High demand increases the work shown at ribosomes and ER.' },
  { key: 'permeability', label: 'Membrane permeability', group: 'environment', value: 100, min: 0, max: 200, step: 10, unit: '% of normal permeability', output: 'Transport / balance', outputKey: 'balance', visible: 'Permeability changes selectivity and water movement.' },
  { key: 'mitochondria', label: 'Mitochondrial function', group: 'organelles', value: 100, min: 0, max: 100, step: 5, unit: '% of normal function', output: 'ATP availability', outputKey: 'atp', visible: 'Mitochondria activity and ATP supply respond.' },
  { key: 'ribosomes', label: 'Ribosome function', group: 'organelles', value: 100, min: 0, max: 100, step: 5, unit: '% of normal function', output: 'Protein production', outputKey: 'protein', visible: 'Protein particles become less frequent as function falls.' },
  { key: 'roughER', label: 'Rough ER function', group: 'organelles', value: 100, min: 0, max: 100, step: 5, unit: '% of normal function', output: 'Protein processing', outputKey: 'protein', visible: 'Protein processing and routing respond.' },
  { key: 'golgi', label: 'Golgi function', group: 'organelles', value: 100, min: 0, max: 100, step: 5, unit: '% of normal function', output: 'Protein export', outputKey: 'export', visible: 'Materials build up before export when packaging slows.' },
  { key: 'lysosomes', label: 'Lysosome function', group: 'organelles', value: 100, min: 0, max: 100, step: 5, unit: '% of normal function', output: 'Waste burden', outputKey: 'waste', visible: 'Waste particles accumulate as recycling slows.' },
  { key: 'nucleusSignal', label: 'Nucleus signaling', group: 'organelles', value: 100, min: 0, max: 100, step: 5, unit: '% of normal function', output: 'Coordination / protein', outputKey: 'protein', visible: 'Instruction-dependent work is reduced.' }
];

const SCENARIOS = [
  { id: 'oxygen', question: 'What happens to usable energy when oxygen becomes limited?', variable: 'oxygen', value: 15, output: 'atp' },
  { id: 'glucose', question: 'What happens to energy supply when glucose is scarce?', variable: 'glucose', value: 1, output: 'atp' },
  { id: 'mitochondria', question: 'What happens when mitochondria function is weakened?', variable: 'mitochondria', value: 20, output: 'atp' },
  { id: 'ribosomes', question: 'What happens to protein production when ribosomes slow down?', variable: 'ribosomes', value: 20, output: 'protein' },
  { id: 'golgi', question: 'What happens to export when Golgi packaging slows?', variable: 'golgi', value: 20, output: 'export' },
  { id: 'lysosomes', question: 'What happens to waste when lysosomes cannot recycle it?', variable: 'lysosomes', value: 20, output: 'waste' },
  { id: 'permeability', question: 'What happens to internal balance when the membrane is too permeable?', variable: 'permeability', value: 95, output: 'balance' },
  { id: 'water', question: 'What happens to cell volume in a hypotonic outside solution?', variable: 'water', value: 250, output: 'volume' }
];

const PROJECT_CASES = [
  { id: 'energy', title: 'Energy failure', variable: 'mitochondria', value: 15, symptoms: 'ATP is low · cell activity is slow · stress is high', candidates: [ 'oxygen', 'glucose', 'mitochondria' ] },
  { id: 'waste', title: 'Waste crisis', variable: 'lysosomes', value: 15, symptoms: 'Waste is high · stress is rising · ATP is near normal', candidates: [ 'lysosomes', 'permeability', 'water' ] },
  { id: 'protein', title: 'Protein production failure', variable: 'ribosomes', value: 15, symptoms: 'Protein production is low · ATP is near normal · downstream flow is weak', candidates: [ 'ribosomes', 'roughER', 'nucleusSignal' ] },
  { id: 'shipping', title: 'Shipping failure', variable: 'golgi', value: 15, symptoms: 'Protein is made · export is low · material backs up near Golgi', candidates: [ 'golgi', 'roughER', 'permeability' ] },
  { id: 'water', title: 'Water balance emergency', variable: 'water', value: 250, symptoms: 'Cell volume is abnormal · internal balance is disrupted', candidates: [ 'water', 'permeability' ] }
];

const PROJECT_ROLES = [ 'Cell biologist', 'Experiment designer', 'Data analyst', 'Systems engineer', 'Science communicator' ];
const PROJECT_PRODUCTS = [ 'Cell rescue report', 'Scientific poster', 'Systems presentation', 'Cell health protocol' ];
const PROJECT_SUCCESS_CRITERIA = [
  'Cell health above 80% and two indicators improve',
  'ATP and protein production both above 70%',
  'Cell volume 85–115% of baseline and transport above 70%'
];

class AnimalCellModel {
  constructor() {
    this.modeProperty = new Property( 'explore' );
    this.selectedOrganelleProperty = new Property( 'nucleus' );
    this.pathwayHighlightProperty = new Property( null );
    this.selectedVariableProperty = new Property( 'oxygen' );
    this.controlGroupProperty = new Property( 'environment' );
    this.experimentPanelProperty = new Property( 'question' );
    this.rightPanelProperty = new Property( 'data' );
    this.selectedScenarioProperty = new Property( SCENARIOS[ 0 ] );
    this.predictionProperty = new Property( null );
    this.feedbackProperty = new Property( 'Make a prediction, then run the test.' );
    this.observationChoiceProperty = new Property( 'The output changed.' );
    this.cerClaimProperty = new Property( 'The condition I changed affected the cell system.' );
    this.cerEvidenceProperty = new Property( 'Use the before-and-after values as evidence.' );
    this.cerReasoningProperty = new Property( 'The changed process is connected to the output I measured.' );
    this.trialsProperty = new Property( [] );
    this.trialStartProperty = new Property( null );
    this.trialStartSettingsProperty = new Property( null );
    this.trialLockedProperty = new Property( false );
    this.advancedExploreProperty = new Property( false );
    this.challengeProperty = new Property( null );
    this.rescueCaseIndex = 0;
    this.challengeFeedbackProperty = new Property( 'Inspect the live evidence and test a possible cause.' );
    this.hintsEnabledProperty = new Property( true );
    this.teacherModeProperty = new Property( false );
    this.teacherListProperty = new Property( 'variables' );
    this.challengeComplexityProperty = new Property( 'Guided' );
    this.enabledVariablesProperty = new Property( VARIABLE_DEFINITIONS.map( item => item.key ) );
    this.enabledOrganellesProperty = new Property( [ 'membrane', 'cytoplasm', 'nucleus', 'nucleolus', 'ribosomes', 'roughER', 'smoothER', 'golgi', 'mitochondria', 'lysosome', 'vesicles', 'vacuole', 'cytoskeleton', 'centrosome' ] );
    this.supportLevelProperty = new Property( 'A — Guided' );
    this.supportMessageProperty = new Property( 'Hints and step-by-step prompts are available.' );
    this.correctPredictionStreak = 0;
    this.struggleCount = 0;

    this.variables = {};
    VARIABLE_DEFINITIONS.forEach( definition => {
      this.variables[ definition.key ] = new NumberProperty( definition.value, {
        range: new Range( definition.min === undefined ? 0 : definition.min, definition.max === undefined ? 100 : definition.max )
      } );
    } );

    this.atpProperty = new NumberProperty( 0 );
    this.proteinProperty = new NumberProperty( 0 );
    this.wasteProperty = new NumberProperty( 0 );
    this.volumeProperty = new NumberProperty( 0 );
    this.balanceProperty = new NumberProperty( 0 );
    this.healthProperty = new NumberProperty( 0 );
    this.cellStatusProperty = new Property( 'Stable' );
    this.phenotypeProperty = new Property( 'HEALTHY' );
    this.waterMovementProperty = new Property( 'Balanced' );
    this.membraneTensionProperty = new NumberProperty( 0 );
    this.exportProperty = new NumberProperty( 0 );
    this.transportProperty = new NumberProperty( 0 );
    this.stressProperty = new NumberProperty( 0 );
    this.flowPhaseProperty = new NumberProperty( 0 );
    this.proteinFlowPhaseProperty = new NumberProperty( 0 );
    this.wasteFlowPhaseProperty = new NumberProperty( 0 );
    this.transportFlowPhaseProperty = new NumberProperty( 0 );
    this.focusEffectKeyProperty = new Property( null );
    this.responseReadyProperty = new Property( true );
    this.responseElapsed = 0;
    this.focusEffectTime = 0;
    this.golgiBacklogProperty = new NumberProperty( 0 );
    this.historyProperty = new Property( [] );
    this.historyTime = 0;
    this.historyInterval = 0.5;
    this.historyElapsed = 0;
    this.selectedTrialsProperty = new Property( [] );
    this.projectActiveProperty = new Property( false );
    this.projectCaseProperty = new Property( PROJECT_CASES[ 0 ] );
    this.projectPageProperty = new Property( 'launch' );
    this.projectNotebookPageProperty = new NumberProperty( 0, { numberType: 'Integer', range: new Range( 0, 3 ) } );
    this.projectMilestonesProperty = new Property( Array( 9 ).fill( false ) );
    this.projectKnowProperty = new Property( 'The cell shows an abnormal live indicator.' );
    this.projectNeedProperty = new Property( 'Which process is most connected to the abnormal indicator?' );
    this.projectHypothesisProperty = new Property( 'If I test the most connected process, the abnormal output will move toward its healthy range.' );
    this.projectPatternsProperty = new Property( 'Compare the direct output and cell health across trials.' );
    this.projectDiagnosisProperty = new Property( 'No diagnosis yet — use evidence from at least three trials.' );
    this.projectRescuePlanProperty = new Property( 'Choose a cause, explain why, then test the rescue.' );
    this.projectConclusionProperty = new Property( 'Use trial values and visible cell changes to support the conclusion.' );
    this.projectReflectionProperty = new Property( 'What evidence changed your thinking?' );
    this.projectProductProperty = new Property( PROJECT_PRODUCTS[ 0 ] );
    this.projectRoleRotationProperty = new NumberProperty( 0, { numberType: 'Integer', range: new Range( 0, PROJECT_ROLES.length - 1 ) } );
    this.requiredTrialsProperty = new NumberProperty( 3, { numberType: 'Integer', range: new Range( 3, 5 ) } );
    this.projectScaffoldingProperty = new Property( 'Guided inquiry' );
    this.projectSuccessCriteriaProperty = new Property( PROJECT_SUCCESS_CRITERIA[ 0 ] );

    this.updateOutputs();
    this.atpProperty.value = this.targets.atp;
    this.proteinProperty.value = this.targets.protein;
    this.wasteProperty.value = this.targets.waste;
    this.volumeProperty.value = this.targets.volume;
    this.balanceProperty.value = this.targets.balance;
    this.waterMovementProperty.value = 'Balanced';
    this.membraneTensionProperty.value = 0;
    this.healthProperty.value = this.targets.health;
    this.cellStatusProperty.value = 'Stable';
    this.phenotypeProperty.value = 'HEALTHY';
    this.exportProperty.value = this.targets.export;
    this.transportProperty.value = this.targets.transport;
    this.stressProperty.value = this.targets.stress;
    this.golgiBacklogProperty.value = this.targets.golgiBacklog;
    this.appliedInputsProperty = new Property( this.getInputSnapshot() );
    this.recordHistorySample();
  }

  /** @public */
  getDefinitions( group ) {
    return VARIABLE_DEFINITIONS.filter( definition => definition.group === group );
  }

  /** @public */
  getInputSnapshot() {
    return Object.fromEntries( Object.entries( this.variables ).map( ( [ key, property ] ) => [ key, property.value ] ) );
  }

  /** Apply the previewed controls to the model only when an experiment is run. @public */
  applyCurrentInputs() {
    this.appliedInputsProperty.value = this.getInputSnapshot();
    this.updateOutputs();
    this.responseElapsed = 0;
    this.responseReadyProperty.value = false;
  }

  /** @private */
  updateCellStatus() {
    const volume = this.volumeProperty.value;
    const inputs = this.appliedInputsProperty.value;
    const membraneFailureRisk = volume >= 165 || ( inputs.permeability >= 190 && Math.abs( inputs.water - 300 ) >= 50 );
    const critical = membraneFailureRisk || this.healthProperty.value < 35 || this.stressProperty.value >= 60 || this.wasteProperty.value >= 82;
    const swollen = volume >= 125;
    const shrunken = volume <= 75;
    const stressed = this.healthProperty.value < 88 || this.stressProperty.value >= 15 || this.wasteProperty.value >= 48 || Math.abs( inputs.ph - 7.4 ) > 0.2;
    const phenotype = critical ? 'CRITICAL' : swollen ? 'SWOLLEN' : shrunken ? 'SHRUNKEN' : stressed ? 'STRESSED' : 'HEALTHY';
    this.phenotypeProperty.value = phenotype;
    this.cellStatusProperty.value = critical ? 'Critical' : phenotype === 'HEALTHY' ? 'Stable' : phenotype[ 0 ] + phenotype.slice( 1 ).toLowerCase();
  }

  /** Set healthy controls while the simulated outputs recover through their normal time response. @public */
  restoreHealthyCellGradually() {
    VARIABLE_DEFINITIONS.forEach( definition => {
      this.variables[ definition.key ].value = definition.value;
    } );
    this.appliedInputsProperty.value = this.getInputSnapshot();
    this.updateOutputs();
    this.trialLockedProperty.value = false;
    this.pathwayHighlightProperty.value = null;
    this.focusEffectKeyProperty.value = null;
    this.predictionProperty.value = null;
    this.responseReadyProperty.value = true;
    this.trialStartProperty.value = { ...this.targets, status: 'Stable' };
    this.trialStartSettingsProperty.value = this.getInputSnapshot();
    this.feedbackProperty.value = 'Healthy conditions restored. Follow the measured model outputs as the cell recovers.';
  }

  /** Start or switch the student investigation to one hidden-cause case. @public */
  startProjectCase( caseId ) {
    const projectCase = PROJECT_CASES.find( item => item.id === caseId ) || PROJECT_CASES[ 0 ];
    this.projectActiveProperty.value = true;
    this.projectCaseProperty.value = projectCase;
    this.projectPageProperty.value = 'launch';
    this.projectNotebookPageProperty.value = 0;
    this.projectMilestonesProperty.value = Array( 9 ).fill( false );
    this.projectKnowProperty.value = 'The cell shows an abnormal live indicator.';
    this.projectNeedProperty.value = 'Which process is most connected to the abnormal indicator?';
    this.projectHypothesisProperty.value = 'If I test the most connected process, the abnormal output will move toward its healthy range.';
    this.projectPatternsProperty.value = 'Compare the direct output and cell health across trials.';
    this.projectDiagnosisProperty.value = 'No diagnosis yet — use evidence from at least three trials.';
    this.projectRescuePlanProperty.value = 'Choose a cause, explain why, then test the rescue.';
    this.projectConclusionProperty.value = 'Use trial values and visible cell changes to support the conclusion.';
    this.projectReflectionProperty.value = 'What evidence changed your thinking?';
    this.projectProductProperty.value = AnimalCellModel.PROJECT_PRODUCTS[ 0 ];
    this.challengeProperty.value = null;
    this.clearTrials();
    this.selectedTrialsProperty.value = [];
    this.resetToHealthyCell();
    this.variables[ projectCase.variable ].value = projectCase.value;
    this.applyCurrentInputs();
    this.selectedVariableProperty.value = projectCase.candidates.find( key => key !== projectCase.variable ) || 'oxygen';
    this.modeProperty.value = 'project';
    this.rightPanelProperty.value = 'data';
    this.startTrial();
    this.completeProjectMilestone( 0 );
  }

  /** Restore the selected mystery-cell starting condition for a controlled project trial. @public */
  startProjectExperiment() {
    this.resetToHealthyCell();
    const projectCase = this.projectCaseProperty.value;
    this.variables[ projectCase.variable ].value = projectCase.value;
    this.applyCurrentInputs();
    this.startTrial();
  }

  /** Mark a project milestone complete without losing earlier evidence. @public */
  completeProjectMilestone( index ) {
    const milestones = [ ...this.projectMilestonesProperty.value ];
    milestones[ index ] = true;
    this.projectMilestonesProperty.value = milestones;
  }

  /** Cycle a structured notebook entry; students still have to replace starters with cited trial evidence. @public */
  cycleProjectNote( key ) {
    const projectCase = this.projectCaseProperty.value;
    const options = {
      know: [
        'The cell shows an abnormal live indicator.',
        'The cell animation and its meter both show a change.',
        'Some systems look normal while one output is disrupted.'
      ],
      need: [
        'Which process is most connected to the abnormal indicator?',
        'Which input can I change while holding the others steady?',
        'Does the direct effect appear before a downstream effect?'
      ],
      hypothesis: [
        'If I test the most connected process, the abnormal output will move toward its healthy range.',
        'If I change one possible cause, the directly connected output will change first.',
        'If I restore the suspected system, cell health will recover gradually.'
      ],
      patterns: [
        'Compare the direct output and cell health across trials.',
        'The strongest evidence is the trial with the clearest before-and-after change.',
        'A downstream output changed after its connected process changed.'
      ],
      diagnosis: projectCase.candidates.map( key => {
        const definition = VARIABLE_DEFINITIONS.find( item => item.key === key );
        return 'Possible cause: ' + definition.label + ' — not yet confirmed.';
      } ).concat( [ 'No diagnosis yet — use evidence from at least three trials.' ] ),
      rescuePlan: [
        'Restore the diagnosed input toward its healthy range, then check ATP, waste, balance, and health.',
        'Test one repair at a time and keep the other conditions controlled.',
        'The rescue should improve at least two indicators without creating a new imbalance.'
      ],
      conclusion: [
        'Use trial values and visible cell changes to support the conclusion.',
        'My evidence supports the diagnosis because the directly connected output changed first.',
        'This is a simplified model: the evidence supports a systems idea, not a real-cell measurement.'
      ],
      reflection: [
        'What evidence changed your thinking?',
        'Which experiment gave the strongest evidence, and why?',
        'What would you test next? How do the organelles depend on one another?'
      ]
    };
    const property = this[ 'project' + key[ 0 ].toUpperCase() + key.slice( 1 ) + 'Property' ];
    const choices = options[ key ];
    property.value = choices[ ( choices.indexOf( property.value ) + 1 ) % choices.length ];
    if ( key === 'diagnosis' && this.trialsProperty.value.length >= this.requiredTrialsProperty.value ) {
      this.completeProjectMilestone( 5 );
    }
  }

  /** @public */
  compareProjectTrials() {
    if ( this.selectedTrialsProperty.value.length >= 2 ) {
      this.completeProjectMilestone( 4 );
    }
  }

  /** Return the next inquiry prompt without revealing the hidden cause. @public */
  getAdaptiveHint() {
    if ( !this.hintsEnabledProperty.value ) {
      return '';
    }
    const supportLevel = this.projectActiveProperty.value ? this.projectScaffoldingProperty.value : this.challengeComplexityProperty.value;
    const threshold = supportLevel === 'Open inquiry' || supportLevel === 'C — Independent' ? 3 :
                      supportLevel === 'Supported inquiry' || supportLevel === 'B — Supported inquiry' ? 2 : 1;
    const hintIndex = this.struggleCount - threshold;
    const hints = [
      'Hint 1: Which output is outside its healthy range?',
      'Hint 2: Which organelle is most connected to that output?',
      'Hint 3: The related organelle is highlighted in the cell.',
      'Hint 4: The connected pathway is highlighted. Test one input and watch its direct effect.'
    ];
    if ( hintIndex >= 2 ) {
      this.triggerFocusEffect( this.selectedVariableProperty.value || 'oxygen' );
    }
    if ( hintIndex >= 3 ) {
      const variableKey = this.selectedVariableProperty.value || 'oxygen';
      this.pathwayHighlightProperty.value = variableKey === 'oxygen' || variableKey === 'glucose' || variableKey === 'mitochondria' ? 'energy' :
                                            variableKey === 'lysosomes' ? 'waste' :
                                            variableKey === 'water' || variableKey === 'permeability' ? 'transport' : 'protein';
    }
    return hintIndex >= 0 ? ' ' + hints[ Math.min( hintIndex, hints.length - 1 ) ] : '';
  }

  /** @public */
  createProjectProduct() {
    const hasThreeTrials = this.trialsProperty.value.length >= this.requiredTrialsProperty.value;
    const hasDiagnosis = !this.projectDiagnosisProperty.value.startsWith( 'No diagnosis yet' );
    const hasCER = this.cerClaimProperty.value !== 'The condition I changed affected the cell system.' &&
                   this.cerEvidenceProperty.value !== 'Use the before-and-after values as evidence.' &&
                   this.cerReasoningProperty.value !== 'The changed process is connected to the output I measured.';
    if ( !hasThreeTrials || !hasDiagnosis || !this.projectMilestonesProperty.value[ 4 ] || !this.projectMilestonesProperty.value[ 6 ] || !hasCER ) {
      this.feedbackProperty.value = 'Finish the required trials, compare evidence, test the rescue, and complete CER before creating the final product.';
      return false;
    }
    this.projectPageProperty.value = 'product';
    this.completeProjectMilestone( 7 );
    return true;
  }

  /** @public */
  defendProject() {
    if ( !this.projectMilestonesProperty.value[ 7 ] || this.projectConclusionProperty.value.startsWith( 'Use trial values' ) || this.projectReflectionProperty.value === 'What evidence changed your thinking?' ) {
      this.feedbackProperty.value = 'Create the product, write an evidence-based conclusion, and reflect before presenting and defending it.';
      return false;
    }
    this.completeProjectMilestone( 8 );
    this.projectPageProperty.value = 'reflection';
    return true;
  }

  /** Cycle the structured CER notebook choices. @public */
  cycleCER( role ) {
    const options = {
      claim: [
        'The condition I changed affected the cell system.',
        'The cell stayed near its baseline for this output.',
        'A weakened organelle caused a downstream change.',
        'More than one cell process contributed to the result.'
      ],
      evidence: [
        'Use the before-and-after values as evidence.',
        'Compare this trial with the previous trial.',
        'Name the live indicator that changed most.',
        'Point to the cell animation and its matching meter.'
      ],
      reasoning: [
        'The changed process is connected to the output I measured.',
        'A direct effect can lead to a downstream effect in a connected system.',
        'This result supports my claim because the data changed in the predicted direction.',
        'The model is simplified, so this supports a concept rather than a real-cell measurement.'
      ]
    };
    const property = this[ 'cer' + role[ 0 ].toUpperCase() + role.slice( 1 ) + 'Property' ];
    const list = options[ role ];
    property.value = list[ ( list.indexOf( property.value ) + 1 ) % list.length ];
    this.updateLatestTrial( 'cer' + role[ 0 ].toUpperCase() + role.slice( 1 ), property.value );
  }

  /** @public */
  cycleObservation() {
    const observations = [
      'The output changed.',
      'The direct effect came first.',
      'The result surprised me.',
      'Other inputs stayed fixed.'
    ];
    const index = observations.indexOf( this.observationChoiceProperty.value );
    this.observationChoiceProperty.value = observations[ ( index + 1 ) % observations.length ];
  }

  /** @public */
  updateLatestTrial( key, value ) {
    const trials = this.trialsProperty.value;
    if ( trials.length ) {
      const updated = [ ...trials ];
      updated[ updated.length - 1 ] = { ...updated[ updated.length - 1 ], [ key ]: value };
      this.trialsProperty.value = updated;
    }
  }

  /** Independent-variable change listener; take the starting snapshot only once per trial. @public */
  startTrial() {
    this.trialStartProperty.value = this.getOutputSnapshot();
    this.trialStartSettingsProperty.value = Object.fromEntries( Object.entries( this.variables ).map( ( [ key, property ] ) => [ key, property.value ] ) );
    this.trialLockedProperty.value = false;
    this.predictionProperty.value = null;
    this.feedbackProperty.value = 'Trial started. Change one variable and observe the evidence.';
  }

  /** Briefly highlight the cell structure most directly affected by a changed input. @public */
  triggerFocusEffect( variableKey ) {
    const focusKeys = {
      oxygen: 'mitochondria', glucose: 'mitochondria', mitochondria: 'mitochondria',
      ribosomes: 'ribosomes', roughER: 'roughER', golgi: 'golgi', lysosomes: 'lysosome',
      permeability: 'membrane', water: 'membrane', ph: 'smoothER', temperature: 'mitochondria'
    };
    this.focusEffectKeyProperty.value = focusKeys[ variableKey ] || 'cytoplasm';
    this.focusEffectTime = 1.6;
  }

  /** @public */
  setScenario( scenarioId ) {
    const scenario = SCENARIOS.find( item => item.id === scenarioId ) || SCENARIOS[ 0 ];
    this.selectedScenarioProperty.value = scenario;
    this.selectedVariableProperty.value = scenario.variable;
    this.resetToHealthyCell();
    this.experimentPanelProperty.value = 'question';
    this.startTrial();
  }

  /** @public */
  runScenario() {
    const scenario = this.selectedScenarioProperty.value;
    if ( !this.trialStartProperty.value ) {
      this.startTrial();
    }
    this.variables[ scenario.variable ].value = scenario.value;
    if ( scenario.secondVariable ) {
      this.variables[ scenario.secondVariable ].value = scenario.secondValue;
    }
    this.applyCurrentInputs();
    this.trialLockedProperty.value = true;
  }

  /** @public */
  makePrediction( direction ) {
    this.predictionProperty.value = direction;
    this.feedbackProperty.value = 'Prediction saved: you expect the selected output to ' + direction + '.';
  }

  /** @public */
  comparePrediction( outputKey ) {
    const prediction = this.predictionProperty.value;
    const before = this.trialStartProperty.value;
    if ( !before || !prediction ) {
      this.feedbackProperty.value = 'Test complete. Compare the live result with your prediction.';
      return;
    }
    const after = this.getOutputSnapshot();
    const difference = after[ outputKey ] - before[ outputKey ];
    const actual = Math.abs( difference ) < 2 ? 'stay about the same' : difference > 0 ? 'increase' : 'decrease';
    const isCorrect = prediction === actual || ( prediction === 'stay the same' && actual === 'stay about the same' );
    this.feedbackProperty.value = 'Result: ' + actual + '. ' + ( isCorrect ? 'Prediction matches.' : 'Prediction differs; use the data.' );
    if ( isCorrect ) {
      this.correctPredictionStreak++;
      this.struggleCount = 0;
    }
    else {
      this.struggleCount++;
      this.correctPredictionStreak = 0;
    }
    this.updateAdaptiveSupport();
    const hint = this.getAdaptiveHint();
    this.feedbackProperty.value += hint;
  }

  /** @public */
  getOutputSnapshot() {
    return {
      atp: this.atpProperty.value,
      protein: this.proteinProperty.value,
      waste: this.wasteProperty.value,
      volume: this.volumeProperty.value,
      balance: this.balanceProperty.value,
      health: this.healthProperty.value,
      export: this.exportProperty.value,
      transport: this.transportProperty.value,
      stress: this.stressProperty.value,
      status: this.cellStatusProperty.value,
      phenotype: this.phenotypeProperty.value,
      waterMovement: this.waterMovementProperty.value,
      membraneTension: this.membraneTensionProperty.value
    };
  }

  /** @public */
  recordTrial() {
    const start = this.trialStartProperty.value || this.getOutputSnapshot();
    const after = this.getOutputSnapshot();
    const scenario = this.selectedScenarioProperty.value;
    const challenge = this.challengeProperty.value;
    const independentVariable = challenge ? challenge.variable : this.selectedVariableProperty.value;
    const definition = VARIABLE_DEFINITIONS.find( item => item.key === independentVariable );
    const dependentVariable = challenge ? challenge.outputKey : definition.outputKey;
    const trial = {
      number: this.trialsProperty.value.length + 1,
      question: challenge ? 'Rescue challenge: ' + challenge.clue : this.modeProperty.value === 'explore' ? 'How does ' + definition.label.toLowerCase() + ' affect ' + definition.output + '?' : scenario.question,
      prediction: this.predictionProperty.value || 'Not recorded',
      independentVariable: definition.label,
      independentVariableKey: independentVariable,
      value: this.variables[ independentVariable ].value,
      dependentVariable: dependentVariable,
      before: start[ dependentVariable ],
      result: after[ dependentVariable ],
      beforeSettings: this.trialStartSettingsProperty.value || Object.fromEntries( Object.entries( this.variables ).map( ( [ key, property ] ) => [ key, property.value ] ) ),
      beforeOutputs: start,
      oxygen: this.variables.oxygen.value,
      atp: after.atp,
      protein: after.protein,
      waste: after.waste,
      cellHealth: after.health,
      cellStatus: after.status,
      observation: this.observationChoiceProperty.value,
      claim: this.cerClaimProperty.value,
      evidence: this.cerEvidenceProperty.value,
      reasoning: this.cerReasoningProperty.value,
      settings: Object.fromEntries( Object.entries( this.variables ).map( ( [ key, property ] ) => [ key, property.value ] ) )
    };
    this.trialsProperty.value = [ ...this.trialsProperty.value, trial ];
    this.feedbackProperty.value = 'Trial ' + trial.number + ' saved. Change one condition to compare another trial.';
    if ( this.projectActiveProperty.value ) {
      this.completeProjectMilestone( 2 );
      if ( this.trialsProperty.value.length >= this.requiredTrialsProperty.value ) {
        this.completeProjectMilestone( 3 );
      }
    }
    return trial;
  }

  /** @public */
  clearTrials() {
    this.trialsProperty.value = [];
  }

  /** @public */
  runExperiment( experiment ) {
    const scenario = SCENARIOS.find( item => item.id === experiment );
    if ( scenario ) {
      this.setScenario( scenario.id );
      this.runScenario();
    }
  }

  /** Start a deterministic but hidden diagnosis case. @public */
  startRescueChallenge() {
    const cases = [
      { id: 'energy', mission: 'ENERGY CRISIS', variable: 'mitochondria', candidates: [ 'mitochondria', 'lysosomes', 'golgi', 'permeability' ], outputKey: 'atp', value: 12, clue: 'Usable energy is low even though oxygen and glucose are available.', target: 'ATP above 80% and cell health above 80%' },
      { id: 'waste', mission: 'WASTE CRISIS', variable: 'lysosomes', candidates: [ 'lysosomes', 'golgi', 'mitochondria', 'permeability' ], outputKey: 'waste', value: 12, clue: 'Waste is building up faster than the cell can recycle it.', target: 'Waste below 25% and cell health above 80%' },
      { id: 'protein', mission: 'PROTEIN FACTORY FAILURE', variable: 'ribosomes', candidates: [ 'ribosomes', 'roughER', 'golgi', 'mitochondria' ], outputKey: 'protein', value: 12, clue: 'Protein output is low, slowing the cell’s ability to make needed materials.', target: 'Protein production above 70% and cell health above 80%' },
      { id: 'export', mission: 'SHIPPING FAILURE', variable: 'golgi', candidates: [ 'golgi', 'roughER', 'ribosomes', 'permeability' ], outputKey: 'export', value: 12, clue: 'Proteins are made, but delivery out of the cell is poor.', target: 'Protein export above 70% and cell health above 80%' },
      { id: 'water', mission: 'WATER BALANCE EMERGENCY', variable: 'water', candidates: [ 'water', 'permeability', 'lysosomes', 'mitochondria' ], outputKey: 'volume', value: 250, clue: 'The cell is swelling because outside solution is hypotonic.', target: 'Cell volume moves toward baseline and cell status stabilizes' }
    ];
    const projectCase = this.projectActiveProperty.value ? this.projectCaseProperty.value : null;
    const next = projectCase ? {
      id: projectCase.id,
      mission: projectCase.title.toUpperCase(),
      variable: projectCase.variable,
      candidates: projectCase.candidates,
      outputKey: projectCase.id === 'energy' ? 'atp' : projectCase.id === 'waste' ? 'waste' : projectCase.id === 'protein' ? 'protein' : projectCase.id === 'shipping' ? 'export' : 'volume',
      value: projectCase.value,
      clue: projectCase.symptoms,
      target: 'Restore the abnormal indicator and improve cell health'
    } : cases[ this.rescueCaseIndex % cases.length ];
    Object.values( this.variables ).forEach( ( property, index ) => {
      property.value = VARIABLE_DEFINITIONS[ index ].value;
    } );
    this.variables[ next.variable ].value = next.value;
    this.applyCurrentInputs();
    this.selectedVariableProperty.value = null;
    this.challengeProperty.value = next;
    this.challengeFeedbackProperty.value = 'Use the clue and live data to decide what to test. The cause is not revealed.';
    this.startTrial();
    this.experimentPanelProperty.value = 'question';
    this.modeProperty.value = 'challenge';
  }

  /** @public */
  testRescue() {
    const challenge = this.challengeProperty.value;
    if ( !challenge ) {
      this.startRescueChallenge();
      return;
    }
    const suspectedValue = this.variables[ challenge.variable ].value;
    const restored = challenge.variable === 'water' ? suspectedValue >= 285 && suspectedValue <= 315 : suspectedValue >= 65;
    let targetReached = challenge.id === 'energy' ? this.atpProperty.value >= 80 && this.healthProperty.value >= 80 :
                          challenge.id === 'waste' ? this.wasteProperty.value < 25 && this.healthProperty.value >= 80 :
                          challenge.id === 'protein' ? this.proteinProperty.value >= 70 && this.healthProperty.value >= 80 :
                          challenge.id === 'export' || challenge.id === 'shipping' ? this.exportProperty.value >= 70 && this.healthProperty.value >= 80 :
                          this.volumeProperty.value >= 85 && this.volumeProperty.value <= 115 && this.healthProperty.value >= 80;
    if ( this.projectActiveProperty.value ) {
      const criteria = this.projectSuccessCriteriaProperty.value;
      if ( criteria === PROJECT_SUCCESS_CRITERIA[ 0 ] ) {
        const before = this.trialStartProperty.value || {};
        const improvedIndicators = [
          this.atpProperty.value > before.atp + 2,
          this.proteinProperty.value > before.protein + 2,
          this.wasteProperty.value < before.waste - 2,
          this.balanceProperty.value > before.balance + 2,
          this.healthProperty.value > before.health + 2,
          this.transportProperty.value > before.transport + 2,
          this.exportProperty.value > before.export + 2,
          Math.abs( this.volumeProperty.value - 100 ) < Math.abs( before.volume - 100 ) - 2
        ].filter( Boolean ).length;
        targetReached = this.healthProperty.value >= 80 && improvedIndicators >= 2;
      }
      else if ( criteria === PROJECT_SUCCESS_CRITERIA[ 1 ] ) {
        targetReached = this.atpProperty.value >= 70 && this.proteinProperty.value >= 70;
      }
      else {
        targetReached = this.volumeProperty.value >= 85 && this.volumeProperty.value <= 115 && this.transportProperty.value >= 70;
      }
    }
    if ( restored && targetReached ) {
      const causeLabel = VARIABLE_DEFINITIONS.find( definition => definition.key === challenge.variable ).label;
      this.challengeFeedbackProperty.value = 'CELL RESCUED — ' + causeLabel + ' was the cause. Explain the evidence.';
      this.recordTrial();
      this.trialLockedProperty.value = true;
      if ( !this.projectActiveProperty.value ) {
        this.rescueCaseIndex++;
      }
      if ( this.projectActiveProperty.value ) {
        this.completeProjectMilestone( 6 );
      }
    }
    else {
      this.struggleCount++;
      this.updateAdaptiveSupport();
      const hint = this.getAdaptiveHint();
      this.challengeFeedbackProperty.value = restored ? 'Repair underway. Wait for the cell data to respond, then test again.' + hint :
                                                'Not rescued yet. Compare evidence and try one cause at a time.' + hint;
    }
  }

  /** @public */
  updateAdaptiveSupport() {
    if ( this.struggleCount >= 2 ) {
      this.supportLevelProperty.value = 'A — Guided';
      this.supportMessageProperty.value = 'A hint is ready: compare the changed variable with the output it can affect directly.';
    }
    else if ( this.correctPredictionStreak >= 3 ) {
      this.supportLevelProperty.value = 'C — Independent';
      this.supportMessageProperty.value = 'Try designing the next fair test without a prompt.';
    }
    else if ( this.correctPredictionStreak >= 1 ) {
      this.supportLevelProperty.value = 'B — Supported inquiry';
      this.supportMessageProperty.value = 'Good evidence use. Choose a new variable and hold the others steady.';
    }
  }

  /** @private */
  updateOutputs() {
    const v = key => ( this.appliedInputsProperty ? this.appliedInputsProperty.value : this.getInputSnapshot() )[ key ];
    const temperatureDeviation = Math.abs( v( 'temperature' ) - 37 );
    const phDeviation = Math.abs( v( 'ph' ) - 7.4 );
    const temperatureFit = Math.max( 0.2, 1 - temperatureDeviation / 10 );
    const phFit = Math.max( 0.12, 1 - Math.max( 0, phDeviation - 0.2 ) * 0.8 );
    const membraneFunction = Math.max( 0, Math.min( 200, v( 'permeability' ) ) );
    const osmoticDeviation = v( 'water' ) - 300;
    // Outside solution below 300 mOsm/L is hypotonic: water enters and the cell swells.
    const volume = Math.max( 30, Math.min( 175, 100 - osmoticDeviation * 0.72 * membraneFunction / 100 ) );
    const osmoticPenalty = Math.abs( osmoticDeviation ) * 0.45;
    const relativeGlucose = clamp( v( 'glucose' ) / 5 * 100 );
    const oxygenFraction = clamp( v( 'oxygen' ) ) / 100;
    const glucoseFraction = relativeGlucose / 100;
    const mitochondrialFraction = clamp( v( 'mitochondria' ) ) / 100;
    const atpTarget = clamp( 100 * Math.pow( oxygenFraction, 0.35 ) * Math.pow( glucoseFraction, 0.35 ) * mitochondrialFraction * temperatureFit * ( 0.65 + phFit * 0.35 ) * ( 1 - v( 'toxins' ) * 0.004 ) );
    // Selective transport works best near normal permeability; too little or too much disrupts homeostasis.
    // Active transport also slows when ATP supply is low; water osmosis itself is shown separately.
    const transport = clamp( ( 100 - Math.abs( 100 - membraneFunction ) * 0.72 - osmoticPenalty ) * phFit * ( 0.4 + 0.6 * atpTarget / 100 ) );
    const balance = clamp( 100 - Math.abs( volume - 100 ) * 1.15 - Math.abs( 100 - Math.min( 100, membraneFunction ) ) * 0.45 - Math.max( 0, membraneFunction - 100 ) * 0.45 );
    const targets = {
      atp: atpTarget,
      volume: volume,
      transport: transport,
      balance: balance
    };
    targets.protein = clamp( Math.min( v( 'nucleusSignal' ), v( 'ribosomes' ), v( 'roughER' ) ) * ( 0.42 + targets.atp * 0.0058 ) * phFit * ( 0.55 + v( 'proteinDemand' ) / 125 ) );
    targets.golgiBacklog = clamp( ( targets.protein * 0.78 + v( 'proteinDemand' ) * 0.22 ) * ( 1 - v( 'golgi' ) / 100 ) );
    targets.export = clamp( Math.min( targets.protein - targets.golgiBacklog * 0.55, v( 'golgi' ), transport, targets.atp + 10 ) );
    const baselineWaste = 10 + v( 'toxins' ) * 0.32 + ( 100 - v( 'lysosomes' ) ) * 0.72;
    targets.stress = clamp( ( 100 - targets.atp ) * 0.28 + baselineWaste * 0.30 + temperatureDeviation * 2.5 + phDeviation * 25 + ( 100 - balance ) * 0.32 + Math.abs( volume - 100 ) * 0.25 + Math.max( 0, membraneFunction - 100 ) * 0.20 );
    targets.waste = clamp( baselineWaste + targets.stress * 0.18 );
    targets.health = clamp( targets.atp * 0.27 + targets.protein * 0.12 + ( 100 - targets.waste ) * 0.20 + balance * 0.24 + ( 100 - targets.stress ) * 0.17 );
    this.targets = targets;
    this.waterMovementProperty.value = osmoticDeviation < -8 ? 'Mostly inward' : osmoticDeviation > 8 ? 'Mostly outward' : 'Balanced';
  }

  /** Advance the visual transport particles. @public */
  step( dt ) {
    this.updateOutputs();
    const inputs = this.appliedInputsProperty.value;
    if ( !this.responseReadyProperty.value ) {
      this.responseElapsed += dt;
      if ( this.responseElapsed >= 10 ) {
        this.responseReadyProperty.value = true;
      }
    }
    const approach = ( current, target, seconds ) => current + ( target - current ) * Math.min( 1, dt / seconds );
    this.atpProperty.value = approach( this.atpProperty.value, this.targets.atp, 2.4 );
    this.volumeProperty.value = approach( this.volumeProperty.value, this.targets.volume, 3.5 );
    this.membraneTensionProperty.value = clamp( Math.abs( this.volumeProperty.value - 100 ) * 1.6 + Math.max( 0, inputs.permeability - 100 ) * 0.25 );
    this.transportProperty.value = approach( this.transportProperty.value, this.targets.transport, 2.8 );
    this.balanceProperty.value = approach( this.balanceProperty.value, this.targets.balance, 3.2 );
    const phDeviation = Math.abs( inputs.ph - 7.4 );
    const phFit = Math.max( 0.12, 1 - Math.max( 0, phDeviation - 0.2 ) * 0.8 );
    this.proteinProperty.value = approach( this.proteinProperty.value, clamp( Math.min( inputs.nucleusSignal, inputs.ribosomes, inputs.roughER ) * ( 0.42 + this.atpProperty.value * 0.0058 ) * phFit * ( 0.55 + inputs.proteinDemand / 125 ) ), 4 );
    this.golgiBacklogProperty.value = approach( this.golgiBacklogProperty.value, clamp( ( this.proteinProperty.value * 0.78 + inputs.proteinDemand * 0.22 ) * ( 1 - inputs.golgi / 100 ) ), 4.5 );
    this.exportProperty.value = approach( this.exportProperty.value, clamp( Math.min( this.proteinProperty.value - this.golgiBacklogProperty.value * 0.55, inputs.golgi, this.transportProperty.value, this.atpProperty.value + 10 ) ), 3.5 );
    this.stressProperty.value = approach( this.stressProperty.value, this.targets.stress, 5 );
    const wasteTarget = clamp( 10 + inputs.toxins * 0.32 + ( 100 - inputs.lysosomes ) * 0.72 + this.stressProperty.value * 0.18 );
    this.wasteProperty.value = approach( this.wasteProperty.value, wasteTarget, 6 );
    const healthTarget = clamp( this.atpProperty.value * 0.27 + this.proteinProperty.value * 0.12 + ( 100 - this.wasteProperty.value ) * 0.20 + this.balanceProperty.value * 0.24 + ( 100 - this.stressProperty.value ) * 0.17 );
    this.healthProperty.value = approach( this.healthProperty.value, healthTarget, 7 );
    this.updateCellStatus();
    const conditionFactor = Math.max( 0.12, 1 - this.stressProperty.value / 140 );
    const activityFactor = 0.008 + ( this.atpProperty.value / 100 ) * ( this.transportProperty.value / 100 ) * conditionFactor * 0.12;
    this.flowPhaseProperty.value = ( this.flowPhaseProperty.value + dt * activityFactor ) % 1;
    this.proteinFlowPhaseProperty.value = ( this.proteinFlowPhaseProperty.value + dt * activityFactor * Math.min( inputs.ribosomes, inputs.roughER, inputs.golgi ) / 100 ) % 1;
    this.wasteFlowPhaseProperty.value = ( this.wasteFlowPhaseProperty.value + dt * activityFactor * inputs.lysosomes / 100 ) % 1;
    const transportRate = this.selectedVariableProperty.value === 'water' ?
                          ( 0.012 + Math.abs( inputs.water - 300 ) / 100 * 0.055 ) * inputs.permeability / 100 :
                          activityFactor * ( 0.4 + inputs.permeability / 60 );
    this.transportFlowPhaseProperty.value = ( this.transportFlowPhaseProperty.value + dt * transportRate ) % 1;
    if ( this.focusEffectTime > 0 ) {
      this.focusEffectTime = Math.max( 0, this.focusEffectTime - dt );
      if ( this.focusEffectTime === 0 ) {
        this.focusEffectKeyProperty.value = null;
      }
    }
    this.historyElapsed += dt;
    while ( this.historyElapsed >= this.historyInterval ) {
      this.historyElapsed -= this.historyInterval;
      this.historyTime += this.historyInterval;
      this.recordHistorySample();
    }
  }

  /** @private */
  recordHistorySample() {
    const sample = { time: this.historyTime, atp: this.atpProperty.value, health: this.healthProperty.value, waste: this.wasteProperty.value };
    this.historyProperty.value = [ ...this.historyProperty.value, sample ].slice( -60 );
  }

  /** Restore the complete classroom healthy baseline. @public */
  resetToHealthyCell() {
    this.resetCell();
    this.applyCurrentInputs();
    this.updateOutputs();
    this.atpProperty.value = this.targets.atp;
    this.proteinProperty.value = this.targets.protein;
    this.wasteProperty.value = this.targets.waste;
    this.volumeProperty.value = this.targets.volume;
    this.balanceProperty.value = this.targets.balance;
    this.healthProperty.value = this.targets.health;
    this.exportProperty.value = this.targets.export;
    this.transportProperty.value = this.targets.transport;
    this.stressProperty.value = this.targets.stress;
    this.updateCellStatus();
    this.golgiBacklogProperty.value = this.targets.golgiBacklog;
    this.historyTime = 0;
    this.historyElapsed = 0;
    this.responseElapsed = 0;
    this.responseReadyProperty.value = true;
    this.historyProperty.value = [];
    this.recordHistorySample();
    this.feedbackProperty.value = 'Healthy baseline restored. All inputs, outputs, and visual activity are reset.';
  }

  /** @public */
  resetCell() {
    VARIABLE_DEFINITIONS.forEach( definition => {
      this.variables[ definition.key ].value = definition.value;
    } );
    if ( this.appliedInputsProperty ) {
      this.appliedInputsProperty.value = this.getInputSnapshot();
    }
    this.predictionProperty.value = null;
    this.trialStartProperty.value = this.getOutputSnapshot();
    this.trialStartSettingsProperty.value = Object.fromEntries( Object.entries( this.variables ).map( ( [ key, property ] ) => [ key, property.value ] ) );
    this.trialLockedProperty.value = false;
    this.challengeProperty.value = null;
    this.pathwayHighlightProperty.value = null;
    this.focusEffectKeyProperty.value = null;
    this.focusEffectTime = 0;
    this.flowPhaseProperty.value = 0;
    this.proteinFlowPhaseProperty.value = 0;
    this.wasteFlowPhaseProperty.value = 0;
    this.transportFlowPhaseProperty.value = 0;
    this.golgiBacklogProperty.value = 0;
    this.feedbackProperty.value = 'Baseline restored. Start a new fair test.';
  }

  /** @public */
  reset() {
    this.modeProperty.value = 'explore';
    this.selectedOrganelleProperty.value = 'nucleus';
    this.pathwayHighlightProperty.value = null;
    this.selectedVariableProperty.value = 'oxygen';
    this.trialLockedProperty.value = false;
    this.advancedExploreProperty.value = false;
    this.controlGroupProperty.value = 'environment';
    this.experimentPanelProperty.value = 'question';
    this.rightPanelProperty.value = 'data';
    this.projectActiveProperty.value = false;
    this.projectPageProperty.value = 'launch';
    this.projectMilestonesProperty.value = Array( 9 ).fill( false );
    this.teacherModeProperty.value = false;
    this.rescueCaseIndex = 0;
    this.teacherListProperty.value = 'variables';
    this.hintsEnabledProperty.value = true;
    this.challengeComplexityProperty.value = 'Guided';
    this.enabledVariablesProperty.value = VARIABLE_DEFINITIONS.map( item => item.key );
    this.enabledOrganellesProperty.value = [ 'membrane', 'cytoplasm', 'nucleus', 'nucleolus', 'ribosomes', 'roughER', 'smoothER', 'golgi', 'mitochondria', 'lysosome', 'vesicles', 'vacuole', 'cytoskeleton', 'centrosome' ];
    this.supportLevelProperty.value = 'A — Guided';
    this.supportMessageProperty.value = 'Hints and step-by-step prompts are available.';
    this.correctPredictionStreak = 0;
    this.struggleCount = 0;
    this.clearTrials();
    this.resetToHealthyCell();
    this.historyProperty.value = [];
    this.recordHistorySample();
    this.selectedTrialsProperty.value = [];
  }
}

/** @public */
AnimalCellModel.VARIABLE_DEFINITIONS = VARIABLE_DEFINITIONS;

/** @public */
AnimalCellModel.SCENARIOS = SCENARIOS;
/** @public */
AnimalCellModel.PROJECT_CASES = PROJECT_CASES;
/** @public */
AnimalCellModel.PROJECT_ROLES = PROJECT_ROLES;
/** @public */
AnimalCellModel.PROJECT_PRODUCTS = PROJECT_PRODUCTS;
/** @public */
AnimalCellModel.PROJECT_SUCCESS_CRITERIA = PROJECT_SUCCESS_CRITERIA;

export default AnimalCellModel;
