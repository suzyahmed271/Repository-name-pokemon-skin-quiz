// Copyright 2015-2026, University of Colorado Boulder

/**
 * Simplified, classroom-scale cause-and-effect model for Animal Cell Systems Lab.
 * Values are relative indicators, not measurements of real cells.
 *
 * @author Suzan Ahmed Mustafa
 */

import NumberProperty from '../../../axon/js/NumberProperty.js';
import Property from '../../../axon/js/Property.js';
import Range from '../../../dot/js/Range.js';

const clamp = value => Math.max( 0, Math.min( 100, value ) );

const VARIABLE_DEFINITIONS = [
  { key: 'oxygen', label: 'Oxygen availability', group: 'environment', value: 100, output: 'ATP / energy', outputKey: 'atp', visible: 'Energy particles slow when oxygen is limited.' },
  { key: 'glucose', label: 'Glucose availability', group: 'environment', value: 100, output: 'ATP / energy', outputKey: 'atp', visible: 'Energy supply changes as fuel availability changes.' },
  { key: 'water', label: 'Outside water level', group: 'environment', value: 50, output: 'Relative cell volume', outputKey: 'volume', visible: 'The cell boundary gently expands or contracts.' },
  { key: 'temperature', label: 'Temperature condition', group: 'environment', value: 50, output: 'Cell performance', outputKey: 'health', visible: 'Very low or high conditions reduce process performance.' },
  { key: 'ph', label: 'pH condition', group: 'conditions', value: 50, output: 'Cell health', outputKey: 'health', visible: 'Conditions far from the preferred range add stress.' },
  { key: 'toxins', label: 'Toxin exposure', group: 'conditions', value: 0, output: 'Cell health / stress', outputKey: 'health', visible: 'Stress marks appear as exposure increases.' },
  { key: 'proteinDemand', label: 'Protein demand', group: 'conditions', value: 55, output: 'Protein output / backlog', outputKey: 'protein', visible: 'High demand increases the work shown at ribosomes and ER.' },
  { key: 'permeability', label: 'Membrane permeability', group: 'conditions', value: 42, output: 'Transport / balance', outputKey: 'balance', visible: 'More open transport changes water and material movement.' },
  { key: 'mitochondria', label: 'Mitochondria function', group: 'organelles', value: 100, output: 'ATP / energy', outputKey: 'atp', visible: 'Mitochondria activity and ATP supply respond.' },
  { key: 'ribosomes', label: 'Ribosome function', group: 'organelles', value: 100, output: 'Protein production', outputKey: 'protein', visible: 'Protein particles become less frequent as function falls.' },
  { key: 'roughER', label: 'Rough ER function', group: 'organelles', value: 100, output: 'Protein processing', outputKey: 'protein', visible: 'Protein processing and routing respond.' },
  { key: 'golgi', label: 'Golgi function', group: 'organelles', value: 100, output: 'Packaging / export', outputKey: 'export', visible: 'Materials build up before export when packaging slows.' },
  { key: 'lysosomes', label: 'Lysosome function', group: 'organelles', value: 100, output: 'Waste buildup', outputKey: 'waste', visible: 'Waste particles accumulate as recycling slows.' },
  { key: 'nucleusSignal', label: 'Nucleus signaling', group: 'organelles', value: 100, output: 'Coordination / protein', outputKey: 'protein', visible: 'Instruction-dependent work is reduced.' }
];

const SCENARIOS = [
  { id: 'oxygen', question: 'What happens to usable energy when oxygen becomes limited?', variable: 'oxygen', value: 15, output: 'atp' },
  { id: 'glucose', question: 'What happens to energy supply when glucose is scarce?', variable: 'glucose', value: 15, output: 'atp' },
  { id: 'mitochondria', question: 'What happens when mitochondria function is weakened?', variable: 'mitochondria', value: 10, output: 'atp' },
  { id: 'ribosomes', question: 'What happens to protein production when ribosomes slow down?', variable: 'ribosomes', value: 10, output: 'protein' },
  { id: 'golgi', question: 'What happens to export when Golgi packaging slows?', variable: 'golgi', value: 10, output: 'export' },
  { id: 'lysosomes', question: 'What happens to waste when lysosomes cannot recycle it?', variable: 'lysosomes', value: 10, output: 'waste' },
  { id: 'permeability', question: 'What happens to internal balance when the membrane is too permeable?', variable: 'permeability', value: 95, output: 'balance' },
  { id: 'water', question: 'What happens to relative cell volume when outside water is high?', variable: 'water', value: 95, output: 'volume' },
  { id: 'nutrients', question: 'What happens when glucose, a nutrient fuel, is limited?', variable: 'glucose', value: 15, output: 'atp' },
  { id: 'nucleus', question: 'What happens when nucleus signaling is reduced?', variable: 'nucleusSignal', value: 10, output: 'protein' }
];

class AnimalCellModel {
  constructor() {
    this.modeProperty = new Property( 'learn' );
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
        numberType: 'Integer',
        range: new Range( 0, 100 )
      } );
    } );

    this.atpProperty = new NumberProperty( 0 );
    this.proteinProperty = new NumberProperty( 0 );
    this.wasteProperty = new NumberProperty( 0 );
    this.volumeProperty = new NumberProperty( 0 );
    this.balanceProperty = new NumberProperty( 0 );
    this.healthProperty = new NumberProperty( 0 );
    this.exportProperty = new NumberProperty( 0 );
    this.transportProperty = new NumberProperty( 0 );
    this.stressProperty = new NumberProperty( 0 );
    this.flowPhaseProperty = new NumberProperty( 0 );
    this.proteinFlowPhaseProperty = new NumberProperty( 0 );
    this.wasteFlowPhaseProperty = new NumberProperty( 0 );
    this.transportFlowPhaseProperty = new NumberProperty( 0 );
    this.focusEffectKeyProperty = new Property( null );
    this.focusEffectTime = 0;
    this.golgiBacklogProperty = new NumberProperty( 0 );
    this.historyProperty = new Property( [] );
    this.historyTime = 0;
    this.historyInterval = 0.5;
    this.historyElapsed = 0;
    this.selectedTrialsProperty = new Property( [] );

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
    this.golgiBacklogProperty.value = this.targets.golgiBacklog;
    Object.values( this.variables ).forEach( property => property.link( () => this.updateOutputs() ) );
    this.recordHistorySample();
  }

  /** @public */
  getDefinitions( group ) {
    return VARIABLE_DEFINITIONS.filter( definition => definition.group === group );
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
    const hint = this.hintsEnabledProperty.value && this.struggleCount >= 2 ? ' Hint: check the direct process first.' : '';
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
      stress: this.stressProperty.value
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
      observation: this.observationChoiceProperty.value,
      claim: this.cerClaimProperty.value,
      evidence: this.cerEvidenceProperty.value,
      reasoning: this.cerReasoningProperty.value,
      settings: Object.fromEntries( Object.entries( this.variables ).map( ( [ key, property ] ) => [ key, property.value ] ) )
    };
    this.trialsProperty.value = [ ...this.trialsProperty.value, trial ];
    this.feedbackProperty.value = 'Trial ' + trial.number + ' saved. Change one condition to compare another trial.';
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
      { id: 'water', mission: 'WATER BALANCE EMERGENCY', variable: 'water', candidates: [ 'water', 'permeability', 'lysosomes', 'mitochondria' ], outputKey: 'volume', value: 95, clue: 'The cell is swelling because outside water is far from balanced.', target: 'Cell volume between 60–90% and cell health above 80%' }
    ];
    const next = cases[ this.rescueCaseIndex % cases.length ];
    Object.values( this.variables ).forEach( ( property, index ) => {
      property.value = VARIABLE_DEFINITIONS[ index ].value;
    } );
    this.variables[ next.variable ].value = next.value;
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
    const restored = challenge.variable === 'water' ? suspectedValue >= 35 && suspectedValue <= 65 : suspectedValue >= 65;
    const targetReached = challenge.id === 'energy' ? this.atpProperty.value >= 80 && this.healthProperty.value >= 80 :
                          challenge.id === 'waste' ? this.wasteProperty.value < 25 && this.healthProperty.value >= 80 :
                          challenge.id === 'protein' ? this.proteinProperty.value >= 70 && this.healthProperty.value >= 80 :
                          challenge.id === 'export' ? this.exportProperty.value >= 70 && this.healthProperty.value >= 80 :
                          this.volumeProperty.value >= 60 && this.volumeProperty.value <= 90 && this.healthProperty.value >= 80;
    if ( restored && targetReached ) {
      const causeLabel = VARIABLE_DEFINITIONS.find( definition => definition.key === challenge.variable ).label;
      this.challengeFeedbackProperty.value = 'CELL RESCUED — ' + causeLabel + ' was the cause. Explain the evidence.';
      this.recordTrial();
      this.trialLockedProperty.value = true;
      this.rescueCaseIndex++;
    }
    else {
      this.struggleCount++;
      this.updateAdaptiveSupport();
      const hint = this.hintsEnabledProperty.value && this.struggleCount >= 2 ? ' Hint: check the first process linked to this output.' : '';
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
    const v = key => this.variables[ key ].value;
    const temperatureFit = Math.max( 0.25, 1 - Math.abs( v( 'temperature' ) - 50 ) / 75 );
    const phFit = Math.max( 0.2, 1 - Math.abs( v( 'ph' ) - 50 ) / 65 );
    const membraneFunction = 100 - Math.abs( v( 'permeability' ) - 42 ) * 1.35;
    const volume = clamp( 75 + ( v( 'water' ) - 50 ) * v( 'permeability' ) * 0.018 );
    const transport = clamp( membraneFunction - Math.abs( v( 'water' ) - 50 ) * v( 'permeability' ) * 0.009 );
    const balance = clamp( 100 - Math.abs( volume - 75 ) * 0.75 - Math.abs( v( 'permeability' ) - 42 ) * 0.9 );
    const targets = {
      atp: clamp( ( v( 'oxygen' ) * 0.36 + v( 'glucose' ) * 0.28 + v( 'mitochondria' ) * 0.36 ) * temperatureFit * ( 1 - v( 'toxins' ) * 0.004 ) ),
      volume: volume,
      transport: transport,
      balance: balance
    };
    targets.protein = clamp( Math.min( v( 'nucleusSignal' ), v( 'ribosomes' ), v( 'roughER' ) ) * ( 0.42 + targets.atp * 0.0058 ) * phFit * ( 0.55 + v( 'proteinDemand' ) / 125 ) );
    targets.golgiBacklog = clamp( ( targets.protein * 0.78 + v( 'proteinDemand' ) * 0.22 ) * ( 1 - v( 'golgi' ) / 100 ) );
    targets.export = clamp( Math.min( targets.protein - targets.golgiBacklog * 0.55, v( 'golgi' ), transport, targets.atp + 10 ) );
    const baselineWaste = 10 + v( 'toxins' ) * 0.32 + ( 100 - v( 'lysosomes' ) ) * 0.72;
    targets.stress = clamp( ( 100 - targets.atp ) * 0.28 + baselineWaste * 0.30 + Math.abs( v( 'temperature' ) - 50 ) * 0.40 + Math.abs( v( 'ph' ) - 50 ) * 0.52 + ( 100 - balance ) * 0.32 + Math.abs( volume - 75 ) * 0.25 );
    targets.waste = clamp( baselineWaste + targets.stress * 0.18 );
    targets.health = clamp( targets.atp * 0.27 + targets.protein * 0.12 + ( 100 - targets.waste ) * 0.20 + balance * 0.24 + ( 100 - targets.stress ) * 0.17 );
    this.targets = targets;
  }

  /** Advance the visual transport particles. @public */
  step( dt ) {
    this.updateOutputs();
    const approach = ( current, target, seconds ) => current + ( target - current ) * Math.min( 1, dt / seconds );
    this.atpProperty.value = approach( this.atpProperty.value, this.targets.atp, 2.4 );
    this.volumeProperty.value = approach( this.volumeProperty.value, this.targets.volume, 3.5 );
    this.transportProperty.value = approach( this.transportProperty.value, this.targets.transport, 2.8 );
    this.balanceProperty.value = approach( this.balanceProperty.value, this.targets.balance, 3.2 );
    this.proteinProperty.value = approach( this.proteinProperty.value, clamp( Math.min( this.variables.nucleusSignal.value, this.variables.ribosomes.value, this.variables.roughER.value ) * ( 0.42 + this.atpProperty.value * 0.0058 ) * Math.max( 0.2, 1 - Math.abs( this.variables.ph.value - 50 ) / 65 ) * ( 0.55 + this.variables.proteinDemand.value / 125 ) ), 4 );
    this.golgiBacklogProperty.value = approach( this.golgiBacklogProperty.value, clamp( ( this.proteinProperty.value * 0.78 + this.variables.proteinDemand.value * 0.22 ) * ( 1 - this.variables.golgi.value / 100 ) ), 4.5 );
    this.exportProperty.value = approach( this.exportProperty.value, clamp( Math.min( this.proteinProperty.value - this.golgiBacklogProperty.value * 0.55, this.variables.golgi.value, this.transportProperty.value, this.atpProperty.value + 10 ) ), 3.5 );
    this.stressProperty.value = approach( this.stressProperty.value, this.targets.stress, 5 );
    const wasteTarget = clamp( 10 + this.variables.toxins.value * 0.32 + ( 100 - this.variables.lysosomes.value ) * 0.72 + this.stressProperty.value * 0.18 );
    this.wasteProperty.value = approach( this.wasteProperty.value, wasteTarget, 6 );
    const healthTarget = clamp( this.atpProperty.value * 0.27 + this.proteinProperty.value * 0.12 + ( 100 - this.wasteProperty.value ) * 0.20 + this.balanceProperty.value * 0.24 + ( 100 - this.stressProperty.value ) * 0.17 );
    this.healthProperty.value = approach( this.healthProperty.value, healthTarget, 7 );
    const conditionFactor = Math.max( 0.12, 1 - this.stressProperty.value / 140 );
    const activityFactor = 0.008 + ( this.atpProperty.value / 100 ) * ( this.transportProperty.value / 100 ) * conditionFactor * 0.12;
    this.flowPhaseProperty.value = ( this.flowPhaseProperty.value + dt * activityFactor ) % 1;
    this.proteinFlowPhaseProperty.value = ( this.proteinFlowPhaseProperty.value + dt * activityFactor * Math.min( this.variables.ribosomes.value, this.variables.roughER.value, this.variables.golgi.value ) / 100 ) % 1;
    this.wasteFlowPhaseProperty.value = ( this.wasteFlowPhaseProperty.value + dt * activityFactor * this.variables.lysosomes.value / 100 ) % 1;
    this.transportFlowPhaseProperty.value = ( this.transportFlowPhaseProperty.value + dt * activityFactor * ( 0.4 + this.variables.permeability.value / 60 ) ) % 1;
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
    this.golgiBacklogProperty.value = this.targets.golgiBacklog;
    this.historyTime = 0;
    this.historyElapsed = 0;
    this.historyProperty.value = [];
    this.recordHistorySample();
    this.feedbackProperty.value = 'Healthy baseline restored. All inputs, outputs, and visual activity are reset.';
  }

  /** @public */
  resetCell() {
    VARIABLE_DEFINITIONS.forEach( definition => {
      this.variables[ definition.key ].value = definition.value;
    } );
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
    this.modeProperty.value = 'learn';
    this.selectedOrganelleProperty.value = 'nucleus';
    this.pathwayHighlightProperty.value = null;
    this.selectedVariableProperty.value = 'oxygen';
    this.trialLockedProperty.value = false;
    this.advancedExploreProperty.value = false;
    this.controlGroupProperty.value = 'environment';
    this.experimentPanelProperty.value = 'question';
    this.rightPanelProperty.value = 'data';
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

export default AnimalCellModel;
