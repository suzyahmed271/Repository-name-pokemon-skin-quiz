// Copyright 2015-2026, University of Colorado Boulder

/**
 * Interactive systems-lab view for the Animal Cell simulation.
 *
 * @author Suzan Ahmed Mustafa
 */

import Dimension2 from '../../../dot/js/Dimension2.js';
import Range from '../../../dot/js/Range.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../scenery/js/nodes/Text.js';
import HBox from '../../../scenery/js/layout/nodes/HBox.js';
import VBox from '../../../scenery/js/layout/nodes/VBox.js';
import FireListener from '../../../scenery/js/listeners/FireListener.js';
import HSlider from '../../../sun/js/HSlider.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import AnimalCellModel from './AnimalCellModel.js';

const INFO = {
  membrane: {
    name: 'Cell membrane', color: '#36B8D0',
    job: 'A selectively permeable boundary that regulates exchange with the environment.',
    connects: 'Water, nutrients, wastes, vesicles, and internal balance.',
    failure: 'If transport control is disrupted, the cell has trouble maintaining stable internal conditions.',
    position: [ 185, 4 ], radius: 21, functionKey: 'permeability'
  },
  cytoplasm: {
    name: 'Cytoplasm', color: '#C9F4FF',
    job: 'The region inside the membrane where organelles are suspended and many reactions occur.',
    connects: 'Surrounds and supports all cell structures.',
    failure: 'This model does not simulate cytoplasm failure separately; it is the shared cell workspace.',
    position: [ -10, 0 ], radius: 78
  },
  nucleus: {
    name: 'Nucleus', color: '#D968E8',
    job: 'Contains DNA and helps coordinate cell activities. Cells use RNA messages to carry instructions to ribosomes.',
    connects: 'Instruction messages guide ribosomes; the nucleolus helps make ribosome components.',
    failure: 'Lower signaling reduces coordinated, instruction-dependent protein production.',
    position: [ -22, -12 ], radius: 48, functionKey: 'nucleusSignal'
  },
  nucleolus: {
    name: 'Nucleolus', color: '#9B40B6',
    job: 'A region inside the nucleus where components used to assemble ribosomes are produced.',
    connects: 'Supports ribosome availability and therefore protein production.',
    failure: 'The simplified model represents reduced ribosome support as lower protein capacity.',
    position: [ -5, -17 ], radius: 14, functionKey: 'nucleusSignal'
  },
  mitochondria: {
    name: 'Mitochondria', color: '#FF9A55',
    job: 'Release usable energy from food molecules through cellular respiration; oxygen and glucose availability matter.',
    connects: 'ATP supports many cell processes, including protein production and transport.',
    failure: 'Reduced function lowers the relative ATP indicator and can limit other processes.',
    position: [ -132, -70 ], radius: 33, functionKey: 'mitochondria'
  },
  ribosomes: {
    name: 'Ribosomes', color: '#FFD06A',
    job: 'Build proteins by using instructions carried in RNA messages.',
    connects: 'Some ribosomes are free in the cytoplasm; others work on rough ER.',
    failure: 'Reduced function lowers protein output and can limit materials the cell needs.',
    position: [ -150, 28 ], radius: 24, functionKey: 'ribosomes'
  },
  roughER: {
    name: 'Rough ER', color: '#68CEE8',
    job: 'A membrane network with ribosomes that helps process and move many proteins.',
    connects: 'Receives newly made proteins and helps route them toward vesicles and Golgi.',
    failure: 'If processing slows, protein traffic toward packaging is reduced.',
    position: [ -87, 89 ], radius: 31, functionKey: 'ribosomes'
  },
  smoothER: {
    name: 'Smooth ER', color: '#6BE0A8',
    job: 'Makes lipids and supports other cell chemistry, including processing some harmful substances.',
    connects: 'Supports membrane materials and works alongside other cell systems.',
    failure: 'This model shows its role as a supporting system; it does not model detailed lipid chemistry.',
    position: [ 11, -111 ], radius: 27
  },
  golgi: {
    name: 'Golgi apparatus', color: '#F263B1',
    job: 'Modifies, sorts, and packages materials for delivery.',
    connects: 'Receives materials from ER and packages them into vesicles.',
    failure: 'Reduced packaging causes export efficiency to fall and materials to back up.',
    position: [ 97, -63 ], radius: 32, functionKey: 'golgi'
  },
  lysosome: {
    name: 'Lysosome', color: '#FF7777',
    job: 'Breaks down and recycles waste and worn-out cell parts.',
    connects: 'Receives materials in vesicles and supports waste control.',
    failure: 'Waste builds up when breakdown and recycling slow.',
    position: [ 86, 103 ], radius: 24, functionKey: 'lysosomes'
  },
  vesicles: {
    name: 'Vesicles', color: '#83DDF3',
    job: 'Small membrane-bound sacs that transport materials inside the cell or to the membrane.',
    connects: 'Link ER, Golgi, lysosomes, and the cell membrane.',
    failure: 'Transport between locations becomes less efficient.',
    position: [ 149, 66 ], radius: 21, functionKey: 'golgi'
  },
  vacuole: {
    name: 'Small vacuole', color: '#A995F4',
    job: 'A small storage sac for water and other materials; animal cells may have small vacuoles.',
    connects: 'Stores materials within the cytoplasm.',
    failure: 'Storage capacity is reduced; this model does not treat it as a large plant-cell vacuole.',
    position: [ 24, 125 ], radius: 23, functionKey: 'water'
  },
  cytoskeleton: {
    name: 'Cytoskeleton', color: '#4E8FA8',
    job: 'A network of protein filaments that helps support cell shape and organize movement.',
    connects: 'Helps position organelles and guide intracellular transport.',
    failure: 'Transport organization and structural support would be reduced; shown conceptually here.',
    position: [ -13, 61 ], radius: 14, functionKey: 'permeability'
  },
  centrosome: {
    name: 'Centrosome / centrioles', color: '#F0B94E',
    job: 'The centrosome helps organize microtubules, especially during cell division.',
    connects: 'Organizes part of the cytoskeleton; it is not a membrane-bound organelle.',
    failure: 'This model identifies the organizer but does not simulate cell division.',
    position: [ 50, 24 ], radius: 19, functionKey: 'permeability'
  }
};

const METRICS = [
  [ 'ATP / usable energy', 'atp', '#E5A02C' ],
  [ 'Protein production', 'protein', '#4A91D3' ],
  [ 'Waste buildup', 'waste', '#D66B5B' ],
  [ 'Relative cell volume', 'volume', '#8A74C7' ],
  [ 'Internal balance', 'balance', '#39A887' ],
  [ 'Cell health indicator', 'health', '#4DA66B' ],
  [ 'Protein export', 'export', '#D15A9F' ],
  [ 'Membrane transport', 'transport', '#39AFC2' ],
  [ 'Cell stress', 'stress', '#CE6744' ]
];

const metricProperty = ( model, key ) => model[ key + 'Property' ];

class AnimalCellScreenView extends ScreenView {
  constructor( model ) {
    super();

    const viewWidth = this.layoutBounds.width;
    const leftX = 12;
    const panelTop = 126;
    const panelHeight = Math.min( 490, this.layoutBounds.height - 154 );
    const sideWidth = 238;
    const rightX = this.layoutBounds.maxX - sideWidth - 12;

    const title = new Text( 'Animal Cell Interactive Systems Lab', {
      font: new PhetFont( { size: 26, weight: 'bold' } ),
      fill: '#125F7B', centerX: this.layoutBounds.centerX, top: 8,
      maxWidth: viewWidth - 24
    } );
    this.addChild( title );
    this.addChild( new Text( 'Explore a simplified model: change one condition, follow the evidence, explain the result.', {
      font: new PhetFont( 13 ), fill: '#486C7A', centerX: this.layoutBounds.centerX,
      top: title.bottom + 2, maxWidth: viewWidth - 30
    } ) );

    const modeItems = [
      [ 'Learn', 'learn', '#61D1EA' ],
      [ 'Explore', 'explore', '#8DD7F1' ],
      [ 'What Happens If?', 'whatif', '#FFB5D9' ],
      [ 'Rescue the Cell', 'challenge', '#FFE080' ]
    ];
    const modeButtons = modeItems.map( item => new RectangularPushButton( {
      content: new Text( item[ 0 ], { font: new PhetFont( 14 ) } ),
      baseColor: item[ 2 ], listener: () => {
        model.modeProperty.value = item[ 1 ];
        if ( item[ 1 ] === 'challenge' && !model.challengeProperty.value ) {
          model.startRescueChallenge();
        }
        if ( item[ 1 ] === 'whatif' ) {
          model.experimentPanelProperty.value = 'question';
          model.setScenario( model.selectedScenarioProperty.value.id );
          model.rightPanelProperty.value = 'data';
        }
        if ( item[ 1 ] === 'explore' ) {
          model.experimentPanelProperty.value = 'question';
          model.rightPanelProperty.value = 'data';
        }
        if ( item[ 1 ] === 'challenge' ) {
          model.experimentPanelProperty.value = 'question';
        }
      }
    } ) );
    this.addChild( new HBox( {
      children: modeButtons, spacing: 6, centerX: this.layoutBounds.centerX, top: 57
    } ) );

    const leftPanel = new Rectangle( 0, 0, sideWidth, panelHeight, 13, 13, {
      fill: '#FFFFFF', stroke: '#82C8DC', lineWidth: 2, left: leftX, top: panelTop
    } );
    const rightPanel = new Rectangle( 0, 0, sideWidth, panelHeight, 13, 13, {
      fill: '#FFFFFF', stroke: '#82C8DC', lineWidth: 2, left: rightX, top: panelTop
    } );
    this.addChild( leftPanel );
    this.addChild( rightPanel );

    const cellRoot = new Node();
    this.addChild( cellRoot );
    const membrane = new Circle( 194, {
      fill: '#A6EAF7', stroke: '#54BFD7', lineWidth: 10, scaleY: 0.82, cursor: 'pointer'
    } );
    const cytoplasm = new Circle( 174, {
      fill: '#E9FBFF', opacity: 0.92, scaleY: 0.82, cursor: 'pointer'
    } );
    membrane.addInputListener( new FireListener( { fire: () => {
      model.selectedOrganelleProperty.value = 'membrane';
      model.rightPanelProperty.value = 'organelle';
    } } ) );
    cytoplasm.addInputListener( new FireListener( { fire: () => {
      model.selectedOrganelleProperty.value = 'cytoplasm';
      model.rightPanelProperty.value = 'organelle';
    } } ) );
    cellRoot.addChild( membrane );
    cellRoot.addChild( cytoplasm );

    // Stylized cytoskeleton tracks make the internal transport system visible.
    [ [ -100, -15, 205, 3, 0.18 ], [ -83, 54, 184, 3, -0.45 ], [ -44, -104, 152, 3, 0.67 ] ].forEach( item => {
      const track = new Rectangle( item[ 0 ], item[ 1 ], item[ 2 ], item[ 3 ], {
        fill: '#82B6C5', opacity: 0.46, rotation: item[ 4 ], pickable: false
      } );
      cellRoot.addChild( track );
    } );

    const organelleNodes = {};
    const organelleShapes = {};
    const createOrganelle = key => {
      const data = INFO[ key ];
      const [ x, y ] = data.position;
      const circle = new Circle( data.radius, {
        fill: data.color, stroke: '#34505C', lineWidth: 2, cursor: 'pointer'
      } );
      const label = new Text( key === 'centrosome' ? 'Centrosome' : key === 'cytoskeleton' ? 'Filaments' : data.name, {
        font: new PhetFont( { size: key === 'cytoskeleton' ? 9 : 10, weight: 'bold' } ),
        fill: '#153248', maxWidth: data.radius * 2.3,
        centerX: 0, centerY: 0, pickable: false
      } );
      const node = new Node( { children: [ circle, label ], x: x, y: y, cursor: 'pointer' } );
      node.addInputListener( new FireListener( { fire: () => {
        model.selectedOrganelleProperty.value = key;
        model.rightPanelProperty.value = 'organelle';
      } } ) );
      organelleNodes[ key ] = node;
      organelleShapes[ key ] = circle;
      cellRoot.addChild( node );
    };
    Object.keys( INFO ).filter( key => key !== 'membrane' && key !== 'cytoplasm' ).forEach( createOrganelle );

    // Moving particles follow the simplified protein, energy, and waste pathways.
    const proteinParticles = [ 0, 1, 2 ].map( () => {
      const particle = new Circle( 5, { fill: '#E14D9B', stroke: '#8A2257', lineWidth: 1 } );
      cellRoot.addChild( particle );
      return particle;
    } );
    const energyParticles = [ 0, 1, 2 ].map( () => {
      const particle = new Circle( 4, { fill: '#F3A719', stroke: '#A66A00', lineWidth: 1 } );
      cellRoot.addChild( particle );
      return particle;
    } );
    const wasteParticles = [ 0, 1 ].map( () => {
      const particle = new Circle( 5, { fill: '#8B6C61', stroke: '#5D443C', lineWidth: 1 } );
      cellRoot.addChild( particle );
      return particle;
    } );
    const wasteBuildup = [ 0, 1, 2, 3, 4, 5 ].map( index => {
      const particle = new Circle( 4, {
        fill: '#9D7667', stroke: '#60483E', lineWidth: 1,
        centerX: 56 + index % 3 * 16, centerY: 77 + Math.floor( index / 3 ) * 18,
        visible: false
      } );
      cellRoot.addChild( particle );
      return particle;
    } );
    cellRoot.scale = Math.min( 0.93, ( panelHeight - 88 ) / 388 );
    cellRoot.centerX = this.layoutBounds.centerX;
    cellRoot.centerY = panelTop + panelHeight * 0.47;

    const flowCaption = new Text( 'Instructions → protein → packaging → export', {
      font: new PhetFont( 11 ), fill: '#345D6C', centerX: this.layoutBounds.centerX,
      top: panelTop + panelHeight - 34, maxWidth: 455
    } );
    const energyCaption = new Text( 'Glucose + oxygen → mitochondria → usable ATP', {
      font: new PhetFont( 11 ), fill: '#345D6C', centerX: this.layoutBounds.centerX,
      top: flowCaption.bottom + 2, maxWidth: 455
    } );
    this.addChild( flowCaption );
    this.addChild( energyCaption );

    const leftContent = new Node();
    const rightContent = new Node();
    this.addChild( leftContent );
    this.addChild( rightContent );

    const makeButton = ( label, listener, color = '#DDF3FA', size = 12 ) => new RectangularPushButton( {
      content: new Text( label, { font: new PhetFont( size ), maxWidth: sideWidth - 26 } ),
      baseColor: color, listener: listener
    } );
    const addPanelTitle = ( root, text, x, y ) => root.addChild( new Text( text, {
      font: new PhetFont( { size: 18, weight: 'bold' } ), fill: '#125F7B',
      left: x + 14, top: y + 12, maxWidth: sideWidth - 28
    } ) );

    const renderLeft = () => {
      leftContent.removeAllChildren();
      const mode = model.modeProperty.value;
      const titleText = mode === 'whatif' ? 'Experiment lab' : mode === 'challenge' ? 'Rescue the Cell' : mode === 'explore' ? 'Explore & test' : 'Learn the system';
      addPanelTitle( leftContent, titleText, leftX, panelTop );
      const tabY = panelTop + 47;
      const tabButtons = [
        [ 'Environment', 'environment' ], [ 'Conditions', 'conditions' ], [ 'Cell parts', 'organelles' ]
      ].map( item => makeButton( item[ 0 ], () => {
        model.controlGroupProperty.value = item[ 1 ];
        model.rightPanelProperty.value = 'data';
      }, model.controlGroupProperty.value === item[ 1 ] ? '#9EE2F0' : '#EAF5F8', 10 ) );
      const tabs = new HBox( { children: tabButtons, spacing: 3, left: leftX + 9, top: tabY } );
      leftContent.addChild( tabs );
      let taskTop = tabs.bottom + 8;
      if ( mode === 'whatif' || mode === 'challenge' || mode === 'explore' ) {
        const taskTabs = [
          [ mode === 'whatif' ? 'Question' : mode === 'challenge' ? 'Diagnose' : 'Guide', 'question' ],
          [ 'Adjust variables', 'controls' ]
        ].map( item => makeButton( item[ 0 ], () => {
          model.experimentPanelProperty.value = item[ 1 ];
          renderLeft();
        }, model.experimentPanelProperty.value === item[ 1 ] ? '#BFEAF2' : '#EAF5F8', 9 ) );
        const taskRow = new HBox( { children: taskTabs, spacing: 4, left: leftX + 10, top: tabs.bottom + 3 } );
        leftContent.addChild( taskRow );
        taskTop = taskRow.bottom + 6;
      }

      if ( mode === 'learn' ) {
        const learnText = new Text( 'Select any structure in the cell. Follow the pathways below the diagram, then open its detail card for connections and failure effects.', {
          font: new PhetFont( 13 ), fill: '#435E69', maxWidth: sideWidth - 28,
          left: leftX + 14, top: tabs.bottom + 15
        } );
        leftContent.addChild( learnText );
        leftContent.addChild( makeButton( 'Open organelle details', () => {
          model.rightPanelProperty.value = 'organelle';
        }, '#BFEAF2', 12 ).mutate( { left: leftX + 14, top: learnText.bottom + 15 } ) );
        const modelNote = new Text( 'Model note: cells use RNA messages between DNA instructions and ribosomes. Pathways here are simplified for learning.', {
          font: new PhetFont( 11 ), fill: '#5A6570', maxWidth: sideWidth - 28,
          left: leftX + 14, top: learnText.bottom + 68
        } );
        leftContent.addChild( modelNote );
      }
      else if ( mode === 'challenge' && model.experimentPanelProperty.value === 'question' ) {
        const challenge = model.challengeProperty.value;
        const complexity = model.challengeComplexityProperty.value;
        const clue = !challenge ? 'Press Start rescue case to examine a cell with one hidden problem.' :
                     complexity === 'Guided' && model.hintsEnabledProperty.value ? challenge.clue :
                     complexity === 'Standard' ? 'One or more live indicators are outside the healthy range. Compare likely causes.' :
                     'Open inquiry: diagnose the problem from live data and organelle behavior; no clue is shown.';
        const clueText = new Text( clue, {
          font: new PhetFont( 12 ), fill: '#435E69', maxWidth: sideWidth - 28,
          left: leftX + 14, top: taskTop
        } );
        leftContent.addChild( clueText );
        const feedback = new Text( model.challengeFeedbackProperty.value, {
          font: new PhetFont( 11 ), fill: '#355967', maxWidth: sideWidth - 28,
          left: leftX + 14, top: clueText.bottom + 11
        } );
        leftContent.addChild( feedback );
        leftContent.addChild( makeButton( 'Start / restart rescue case', () => model.startRescueChallenge(), '#FFE080', 11 ).mutate( { left: leftX + 14, top: feedback.bottom + 11 } ) );
        leftContent.addChild( makeButton( 'Test whether the cell is rescued', () => model.testRescue(), '#A9E7C2', 11 ).mutate( { left: leftX + 14, top: feedback.bottom + 53 } ) );
        const hintText = new Text( model.hintsEnabledProperty.value ? model.supportMessageProperty.value : 'Hints are off in Teacher Mode.', {
          font: new PhetFont( 10 ), fill: '#58656B', maxWidth: sideWidth - 28,
          left: leftX + 14, top: feedback.bottom + 102
        } );
        leftContent.addChild( hintText );
      }
      else if ( mode === 'challenge' ) {
        const instruction = new Text( 'Use the controls below to change a suspected cause, then return to Diagnose and test whether the cell recovered.', {
          font: new PhetFont( 11 ), fill: '#435E69', maxWidth: sideWidth - 28,
          left: leftX + 14, top: taskTop
        } );
        leftContent.addChild( instruction );
        const controlsActions = new HBox( { children: [
          makeButton( 'Start trial', () => model.startTrial(), '#EAF5F8', 8 ),
          makeButton( 'Save trial', () => {
            model.recordTrial();
            model.rightPanelProperty.value = 'notebook';
            renderRight();
          }, '#BCEACB', 8 ),
          makeButton( 'Reset', () => model.startRescueChallenge(), '#F2E6CA', 8 )
        ], spacing: 2, left: leftX + 8, top: instruction.bottom + 4 } );
        leftContent.addChild( controlsActions );
      }
      else if ( mode === 'whatif' && model.experimentPanelProperty.value === 'question' ) {
        const scenario = model.selectedScenarioProperty.value;
        const scenarioText = new Text( 'Question: ' + scenario.question, {
          font: new PhetFont( 12 ), fill: '#435E69', maxWidth: sideWidth - 28,
          left: leftX + 14, top: taskTop
        } );
        leftContent.addChild( scenarioText );
        const nextButton = makeButton( 'Next question', () => {
          const list = AnimalCellModel.SCENARIOS;
          const index = list.findIndex( item => item.id === model.selectedScenarioProperty.value.id );
          model.setScenario( list[ ( index + 1 ) % list.length ].id );
          renderLeft();
        }, '#F8DEEC', 11 );
        nextButton.left = leftX + 14;
        nextButton.top = scenarioText.bottom + 7;
        leftContent.addChild( nextButton );

        const predictionLabel = new Text( 'Before testing, predict the selected output:', {
          font: new PhetFont( 10 ), fill: '#435E69', left: leftX + 14, top: nextButton.bottom + 9
        } );
        leftContent.addChild( predictionLabel );
        const predictionButtons = [ 'increase', 'decrease', 'stay the same' ].map( direction => makeButton( direction, () => {
          model.makePrediction( direction );
          renderLeft();
        }, model.predictionProperty.value === direction ? '#B5E8C0' : '#EAF5F8', 9 ) );
        const predictionRow = new HBox( { children: predictionButtons, spacing: 3, left: leftX + 10, top: predictionLabel.bottom + 5 } );
        leftContent.addChild( predictionRow );
        const runButton = makeButton( 'Run one-variable test', () => {
          model.runScenario();
          model.rightPanelProperty.value = 'data';
          renderLeft();
          renderRight();
        }, '#FFEDAA', 11 );
        runButton.left = leftX + 14;
        runButton.top = predictionRow.bottom + 7;
        leftContent.addChild( runButton );
        const feedback = new Text( model.feedbackProperty.value, {
          font: new PhetFont( 10 ), fill: '#3F6873', maxWidth: sideWidth - 28,
          left: leftX + 14, top: runButton.bottom + 8
        } );
        leftContent.addChild( feedback );
        const supportText = new Text( model.hintsEnabledProperty.value ? model.supportMessageProperty.value : 'Hints are off in Teacher Mode.', {
          font: new PhetFont( 9 ), fill: '#58656B', maxWidth: sideWidth - 28,
          left: leftX + 14, top: feedback.bottom + 4
        } );
        leftContent.addChild( supportText );
        const controlsLabel = new Text( 'Adjust a control below, then compare the data. Keep other conditions steady.', {
          font: new PhetFont( 10 ), fill: '#536A73', maxWidth: sideWidth - 28,
          left: leftX + 14, top: supportText.bottom + 4
        } );
        leftContent.addChild( controlsLabel );
        leftContent.addChild( makeButton( 'Save trial + observation', () => {
          model.recordTrial();
          model.rightPanelProperty.value = 'notebook';
          renderRight();
        }, '#BCEACB', 10 ).mutate( { left: leftX + 14, top: controlsLabel.bottom + 7 } ) );
        leftContent.addChild( makeButton( 'Reset cell conditions', () => model.resetCell(), '#F2E6CA', 9 ).mutate( { left: leftX + 14, top: controlsLabel.bottom + 40 } ) );
      }
      else if ( mode === 'whatif' ) {
        const instruction = new Text( 'Adjust one variable at a time. Keep other settings steady, then save the result as a trial.', {
          font: new PhetFont( 11 ), fill: '#435E69', maxWidth: sideWidth - 28,
          left: leftX + 14, top: taskTop
        } );
        leftContent.addChild( instruction );
        const controlsActions = new HBox( { children: [
          makeButton( 'Start trial', () => model.startTrial(), '#EAF5F8', 8 ),
          makeButton( 'Save trial', () => {
            model.recordTrial();
            model.rightPanelProperty.value = 'notebook';
            renderRight();
          }, '#BCEACB', 8 ),
          makeButton( 'Reset', () => model.resetCell(), '#F2E6CA', 8 )
        ], spacing: 2, left: leftX + 8, top: instruction.bottom + 4 } );
        leftContent.addChild( controlsActions );
      }
      else if ( mode === 'explore' && model.experimentPanelProperty.value === 'question' ) {
        const prompts = new Text( 'Try a fair investigation:\n• Compare two structures in one pathway.\n• Change one condition and watch direct and downstream effects.\n• Record and compare at least two trials.', {
          font: new PhetFont( 11 ), fill: '#435E69', maxWidth: sideWidth - 28,
          left: leftX + 14, top: taskTop
        } );
        leftContent.addChild( prompts );
        leftContent.addChild( makeButton( 'Begin exploring variables', () => {
          model.experimentPanelProperty.value = 'controls';
          renderLeft();
        }, '#BFEAF2', 10 ).mutate( { left: leftX + 14, top: prompts.bottom + 8 } ) );
        leftContent.addChild( makeButton( 'Reset healthy cell', () => model.resetCell(), '#F2E6CA', 9 ).mutate( { left: leftX + 14, top: prompts.bottom + 42 } ) );
      }
      else {
        const supportMessage = model.hintsEnabledProperty.value ? model.supportMessageProperty.value : 'Hints are off in Teacher Mode.';
        const support = new Text( model.supportLevelProperty.value + ': ' + supportMessage, {
          font: new PhetFont( 9 ), fill: '#435E69', maxWidth: sideWidth - 28,
          left: leftX + 14, top: taskTop
        } );
        leftContent.addChild( support );
        const startTrialButton = makeButton( 'Start / baseline snapshot', () => model.startTrial(), '#EAF5F8', 9 );
        startTrialButton.left = leftX + 14;
        startTrialButton.top = support.bottom + 3;
        leftContent.addChild( startTrialButton );
        const trialButton = makeButton( 'Record trial', () => {
          model.recordTrial();
          model.rightPanelProperty.value = 'notebook';
          renderRight();
        }, '#BCEACB', 9 );
        trialButton.left = leftX + 14;
        trialButton.top = startTrialButton.bottom + 3;
        leftContent.addChild( trialButton );
      }

      renderSliders( mode );
    };

    const sliderRoot = new Node();
    this.addChild( sliderRoot );
    let sliderUnlinks = [];
    const renderSliders = mode => {
      sliderUnlinks.forEach( unlink => unlink() );
      sliderUnlinks = [];
      sliderRoot.removeAllChildren();
      if ( mode === 'learn' || ( ( mode === 'whatif' || mode === 'challenge' || mode === 'explore' ) && model.experimentPanelProperty.value !== 'controls' ) ) {
        return;
      }
      const group = model.controlGroupProperty.value;
      const definitions = model.getDefinitions( group );
      const allowed = new Set( model.enabledVariablesProperty.value );
      const visibleDefinitions = definitions.filter( definition => allowed.has( definition.key ) );
      const startY = panelTop + 190;
      const rowHeight = Math.min( 60, ( panelTop + panelHeight - startY - 8 ) / Math.max( visibleDefinitions.length, 1 ) );
      visibleDefinitions.forEach( ( definition, index ) => {
        const y = startY + index * rowHeight;
        const label = new Text( definition.label, {
          font: new PhetFont( 10 ), fill: '#183A4B', left: leftX + 12, top: y,
          maxWidth: sideWidth - 45
        } );
        const value = new Text( '', {
          font: new PhetFont( { size: 10, weight: 'bold' } ), fill: '#125F7B',
          right: leftX + sideWidth - 12, top: y
        } );
        const property = model.variables[ definition.key ];
        value.string = property.value + '%';
        const updateValue = current => {
          value.string = current + '%';
          model.selectedVariableProperty.value = definition.key;
        };
        property.lazyLink( updateValue );
        sliderUnlinks.push( () => property.unlink( updateValue ) );
        const slider = new HSlider( property, new Range( 0, 100 ), {
          trackSize: new Dimension2( sideWidth - 54, 4 ),
          thumbSize: new Dimension2( 14, 22 ),
          constrainValue: input => Math.round( input / 5 ) * 5
        } );
        slider.left = leftX + 12;
        slider.top = label.bottom + 3;
        sliderRoot.addChild( new Text( 'Affects: ' + definition.output, {
          font: new PhetFont( 8 ), fill: '#526A73', left: leftX + 12,
          top: slider.bottom + 1, maxWidth: sideWidth - 24
        } ) );
        sliderRoot.addChild( label );
        sliderRoot.addChild( value );
        sliderRoot.addChild( slider );
      } );
    };

    let rightPanelUnlinks = [];
    const linkPanelProperty = ( property, listener ) => {
      property.lazyLink( listener );
      rightPanelUnlinks.push( () => property.unlink( listener ) );
    };
    const renderRight = () => {
      rightPanelUnlinks.forEach( unlink => unlink() );
      rightPanelUnlinks = [];
      rightContent.removeAllChildren();
      const tabs = [
        [ 'Data', 'data' ], [ 'Part', 'organelle' ], [ 'Notebook', 'notebook' ], [ 'Teacher', 'teacher' ]
      ].map( item => makeButton( item[ 0 ], () => {
        model.rightPanelProperty.value = item[ 1 ];
        renderRight();
      }, model.rightPanelProperty.value === item[ 1 ] ? '#9EE2F0' : '#EAF5F8', 9 ) );
      const tabRow = new HBox( { children: tabs, spacing: 2, left: rightX + 8, top: panelTop + 7 } );
      rightContent.addChild( tabRow );
      const panelMode = model.rightPanelProperty.value;

      if ( panelMode === 'data' ) {
        rightContent.addChild( new Text( 'Live Cell Data', {
          font: new PhetFont( { size: 17, weight: 'bold' } ), fill: '#125F7B',
          left: rightX + 13, top: tabRow.bottom + 8
        } ) );
        METRICS.forEach( ( metric, index ) => {
          const y = tabRow.bottom + 37 + index * 37;
          const label = new Text( metric[ 0 ], {
            font: new PhetFont( 10 ), fill: '#294957', left: rightX + 13, top: y
          } );
          const number = new Text( '', {
            font: new PhetFont( { size: 10, weight: 'bold' } ), fill: '#173A4A',
            right: rightX + sideWidth - 12, top: y
          } );
          const back = new Rectangle( 0, 0, sideWidth - 26, 8, 3, 3, {
            fill: '#E2EAED', left: rightX + 13, top: y + 17
          } );
          const bar = new Rectangle( 0, 0, 1, 8, 3, 3, {
            fill: metric[ 2 ], left: rightX + 13, top: y + 17
          } );
          const property = metricProperty( model, metric[ 1 ] );
          const updateMetric = current => {
            number.string = current + '%';
            bar.scaleX = Math.max( 0.01, current / 100 );
          };
          updateMetric( property.value );
          linkPanelProperty( property, updateMetric );
          rightContent.addChild( label );
          rightContent.addChild( number );
          rightContent.addChild( back );
          rightContent.addChild( bar );
        } );
        const status = new Text( 'O₂ supply ' + model.variables.oxygen.value + '/100  •  Glucose ' + model.variables.glucose.value + '/100', {
          font: new PhetFont( 10 ), fill: '#526A73', left: rightX + 13,
          top: tabRow.bottom + 37 + METRICS.length * 37
        } );
        rightContent.addChild( status );
        const updateFuelStatus = () => {
          status.string = 'O₂ supply ' + model.variables.oxygen.value + '/100  •  Glucose ' + model.variables.glucose.value + '/100';
        };
        linkPanelProperty( model.variables.oxygen, updateFuelStatus );
        linkPanelProperty( model.variables.glucose, updateFuelStatus );
      }
      else if ( panelMode === 'organelle' ) {
        const data = INFO[ model.selectedOrganelleProperty.value ];
        addPanelTitle( rightContent, data.name, rightX, tabRow.bottom + 1 );
        const details = [ 'Function: ' + data.job, 'Connects to: ' + data.connects, 'If reduced: ' + data.failure ];
        let y = tabRow.bottom + 37;
        details.forEach( text => {
          const description = new Text( text, {
            font: new PhetFont( 11 ), fill: '#294957', maxWidth: sideWidth - 26,
            left: rightX + 13, top: y
          } );
          rightContent.addChild( description );
          y = description.bottom + 10;
        } );
        rightContent.addChild( makeButton( 'Hear explanation', () => {
          if ( window.speechSynthesis ) {
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak( new SpeechSynthesisUtterance( data.name + '. ' + data.job + ' ' + data.connects ) );
          }
        }, '#A9E7C2', 11 ).mutate( { left: rightX + 13, top: y + 4 } ) );
      }
      else if ( panelMode === 'notebook' ) {
        addPanelTitle( rightContent, 'Lab notebook', rightX, tabRow.bottom + 1 );
        const note = new Text( 'Saved trials: ' + model.trialsProperty.value.length + '\nPrediction → test → observation → CER explanation', {
          font: new PhetFont( 10 ), fill: '#526A73', maxWidth: sideWidth - 26,
          left: rightX + 13, top: tabRow.bottom + 34
        } );
        rightContent.addChild( note );
        let y = note.bottom + 5;
        const cerEntries = [
          [ 'Claim', model.cerClaimProperty.value, 'claim' ],
          [ 'Evidence', model.cerEvidenceProperty.value, 'evidence' ],
          [ 'Reasoning', model.cerReasoningProperty.value, 'reasoning' ]
        ];
        cerEntries.forEach( entry => {
          const text = new Text( entry[ 0 ] + ': ' + entry[ 1 ], {
            font: new PhetFont( 8 ), fill: '#294957', maxWidth: sideWidth - 26,
            left: rightX + 13, top: y
          } );
          rightContent.addChild( text );
          y = text.bottom + 1;
          const choose = makeButton( 'Next ' + entry[ 0 ].toLowerCase(), () => {
            model.cycleCER( entry[ 2 ] );
            renderRight();
          }, '#EAF5F8', 8 );
          choose.left = rightX + 13;
          choose.top = y;
          rightContent.addChild( choose );
          y = choose.bottom + 2;
        } );
        rightContent.addChild( new Text( 'Trials: Question | independent variable | dependent result | observation', {
          font: new PhetFont( 8 ), fill: '#294957', maxWidth: sideWidth - 26,
          left: rightX + 13, top: y
        } ) );
        y += 19;
        model.trialsProperty.value.slice( -2 ).forEach( trial => {
          const item = new Text( '#' + trial.number + ' ' + trial.question.slice( 0, 55 ) + '\nIV: ' + trial.independentVariable + ' = ' + trial.value + '%; prediction: ' + trial.prediction + '\nDV: ' + trial.dependentVariable + ' ' + trial.before + '→' + trial.result + '%; ' + trial.observation, {
            font: new PhetFont( 8 ), fill: '#294957', maxWidth: sideWidth - 26,
            left: rightX + 13, top: y
          } );
          rightContent.addChild( item );
          const graphY = item.bottom + 2;
          rightContent.addChild( new Rectangle( 0, 0, sideWidth - 26, 5, 2, 2, {
            fill: '#E2EAED', left: rightX + 13, top: graphY
          } ) );
          const beforeBar = new Rectangle( 0, 0, sideWidth - 26, 3, 1, 1, {
            fill: '#4A91D3', left: rightX + 13, top: graphY
          } );
          const afterBar = new Rectangle( 0, 0, sideWidth - 26, 3, 1, 1, {
            fill: '#D15A9F', left: rightX + 13, top: graphY + 3
          } );
          beforeBar.scaleX = Math.max( 0.01, trial.before / 100 );
          afterBar.scaleX = Math.max( 0.01, trial.result / 100 );
          rightContent.addChild( beforeBar );
          rightContent.addChild( afterBar );
          y = graphY + 10;
        } );
        const observationButton = makeButton( 'Change observation note', () => {
          model.cycleObservation();
          renderRight();
        }, '#EAF5F8', 9 );
        observationButton.left = rightX + 13;
        observationButton.top = Math.min( y + 3, panelTop + panelHeight - 52 );
        rightContent.addChild( observationButton );
        rightContent.addChild( new Text( 'Current note: ' + model.observationChoiceProperty.value, {
          font: new PhetFont( 9 ), fill: '#526A73', maxWidth: sideWidth - 26,
          left: rightX + 13, top: observationButton.bottom + 4
        } ) );
      }
      else {
        renderTeacherPanel( rightContent, tabRow );
      }
    };

    const renderTeacherPanel = ( root, tabRow ) => {
      const teacherOn = model.teacherModeProperty.value;
      addPanelTitle( root, 'Teacher Mode', rightX, tabRow.bottom + 1 );
      const toggle = makeButton( teacherOn ? 'Teacher controls: ON' : 'Teacher controls: OFF', () => {
        model.teacherModeProperty.value = !model.teacherModeProperty.value;
        renderRight();
      }, teacherOn ? '#FFE080' : '#EAF5F8', 10 );
      toggle.left = rightX + 13;
      toggle.top = tabRow.bottom + 36;
      root.addChild( toggle );
      if ( !teacherOn ) {
        root.addChild( new Text( 'Turn on to choose available variables and cell structures, toggle hints, and set challenge complexity.', {
          font: new PhetFont( 10 ), fill: '#526A73', maxWidth: sideWidth - 26,
          left: rightX + 13, top: toggle.bottom + 8
        } ) );
        return;
      }
      const groupToggle = makeButton( model.teacherListProperty.value === 'variables' ? 'Show organelles to include' : 'Show variables to include', () => {
        model.teacherListProperty.value = model.teacherListProperty.value === 'variables' ? 'organelles' : 'variables';
        renderRight();
      }, '#DCEEF4', 9 );
      groupToggle.left = rightX + 13;
      groupToggle.top = toggle.bottom + 5;
      root.addChild( groupToggle );
      const names = model.teacherListProperty.value === 'variables' ?
                    AnimalCellModel.VARIABLE_DEFINITIONS.map( item => [ item.key, item.label ] ) :
                    Object.keys( INFO ).map( key => [ key, INFO[ key ].name ] );
      const enabled = model.teacherListProperty.value === 'variables' ? model.enabledVariablesProperty : model.enabledOrganellesProperty;
      names.forEach( ( item, index ) => {
        const isEnabled = enabled.value.includes( item[ 0 ] );
        const row = new Text( ( isEnabled ? '✓ ' : '□ ' ) + item[ 1 ], {
          font: new PhetFont( 9 ), fill: isEnabled ? '#235B3D' : '#785454',
          left: rightX + 15, top: groupToggle.bottom + 6 + index * 19,
          maxWidth: sideWidth - 30, cursor: 'pointer'
        } );
        row.addInputListener( new FireListener( { fire: () => {
          const next = enabled.value.includes( item[ 0 ] ) ? enabled.value.filter( key => key !== item[ 0 ] ) : [ ...enabled.value, item[ 0 ] ];
          enabled.value = next;
          renderRight();
        } } ) );
        root.addChild( row );
      } );
      const hintButton = makeButton( model.hintsEnabledProperty.value ? 'Hints: on' : 'Hints: off', () => {
        model.hintsEnabledProperty.value = !model.hintsEnabledProperty.value;
        renderRight();
      }, '#EAF5F8', 9 );
      hintButton.left = rightX + 13;
      hintButton.top = panelTop + panelHeight - 82;
      root.addChild( hintButton );
      const complexityButton = makeButton( 'Challenge: ' + model.challengeComplexityProperty.value + ' (change)', () => {
        const levels = [ 'Guided', 'Standard', 'Open inquiry' ];
        const index = levels.indexOf( model.challengeComplexityProperty.value );
        model.challengeComplexityProperty.value = levels[ ( index + 1 ) % levels.length ];
        renderRight();
      }, '#EAF5F8', 9 );
      complexityButton.left = rightX + 13;
      complexityButton.top = hintButton.bottom + 3;
      root.addChild( complexityButton );
    };

    model.controlGroupProperty.link( () => renderLeft() );
    model.modeProperty.link( () => renderLeft() );
    model.rightPanelProperty.link( () => renderRight() );
    model.selectedOrganelleProperty.link( key => {
      Object.keys( organelleShapes ).forEach( orgKey => {
        organelleShapes[ orgKey ].lineWidth = orgKey === key ? 5 : 2;
        organelleShapes[ orgKey ].stroke = orgKey === key ? '#102D3A' : '#34505C';
      } );
      renderRight();
    } );
    model.enabledVariablesProperty.link( () => renderLeft() );
    model.enabledOrganellesProperty.link( enabled => {
      Object.keys( INFO ).forEach( key => {
        if ( organelleNodes[ key ] ) {
          organelleNodes[ key ].visible = enabled.includes( key );
        }
      } );
      membrane.visible = enabled.includes( 'membrane' );
      cytoplasm.visible = enabled.includes( 'cytoplasm' );
    } );
    model.selectedScenarioProperty.link( () => renderLeft() );
    model.predictionProperty.link( () => renderLeft() );
    model.feedbackProperty.link( () => renderLeft() );
    model.challengeFeedbackProperty.link( () => renderLeft() );
    model.supportLevelProperty.link( () => renderLeft() );
    model.supportMessageProperty.link( () => renderLeft() );
    model.hintsEnabledProperty.link( () => renderLeft() );
    model.trialsProperty.link( () => renderRight() );
    model.teacherModeProperty.link( () => renderRight() );
    model.teacherListProperty.link( () => renderRight() );
    model.challengeComplexityProperty.link( () => {
      if ( model.rightPanelProperty.value === 'teacher' ) {
        renderRight();
      }
      if ( model.modeProperty.value === 'challenge' ) {
        renderLeft();
      }
    } );

    // Visual properties respond to model outputs; the circles are schematic, not to scale.
    model.volumeProperty.link( volume => {
      const scaleFactor = 0.91 + volume * 0.0012;
      membrane.scaleX = scaleFactor;
      membrane.scaleY = scaleFactor * 0.82;
      cytoplasm.scaleX = scaleFactor * 0.9;
      cytoplasm.scaleY = scaleFactor * 0.74;
    } );
    model.healthProperty.link( health => {
      membrane.stroke = health < 45 ? '#D84E58' : health < 68 ? '#E5A03A' : '#54BFD7';
      membrane.lineWidth = health < 45 ? 15 : 10;
    } );
    const organelleFunctions = {
      mitochondria: 'mitochondria', ribosomes: 'ribosomes', roughER: 'ribosomes',
      golgi: 'golgi', lysosome: 'lysosomes', nucleolus: 'nucleusSignal', nucleus: 'nucleusSignal',
      smoothER: 'ph'
    };
    Object.entries( organelleFunctions ).forEach( entry => {
      model.variables[ entry[ 1 ] ].link( current => {
        organelleNodes[ entry[ 0 ] ].opacity = 0.28 + 0.72 * current / 100;
      } );
    } );
    model.atpProperty.link( atp => {
      organelleNodes.mitochondria.scale = 0.88 + atp / 400;
      energyParticles.forEach( particle => { particle.opacity = 0.2 + atp / 125; } );
    } );
    model.proteinProperty.link( protein => {
      organelleNodes.ribosomes.scale = 0.86 + protein / 360;
      proteinParticles.forEach( particle => { particle.opacity = 0.18 + protein / 120; } );
    } );
    model.wasteProperty.link( waste => {
      wasteParticles.forEach( particle => { particle.opacity = 0.18 + waste / 115; } );
      wasteBuildup.forEach( ( particle, index ) => {
        particle.visible = waste > 30 + index * 10;
      } );
    } );
    model.transportProperty.link( transport => {
      organelleNodes.vesicles.opacity = 0.25 + transport / 130;
    } );
    model.flowPhaseProperty.link( phase => {
      proteinParticles.forEach( ( particle, index ) => {
        const t = ( phase + index / proteinParticles.length ) % 1;
        if ( t < 0.48 ) {
          particle.centerX = -90 + t / 0.48 * 177;
          particle.centerY = 65 - t / 0.48 * 116;
        }
        else {
          particle.centerX = 87 + ( t - 0.48 ) / 0.52 * 101;
          particle.centerY = -51 + ( t - 0.48 ) / 0.52 * 55;
        }
      } );
      energyParticles.forEach( ( particle, index ) => {
        const angle = ( phase + index / energyParticles.length ) * Math.PI * 2;
        particle.centerX = -132 + Math.cos( angle ) * 43;
        particle.centerY = -70 + Math.sin( angle ) * 34;
      } );
      wasteParticles.forEach( ( particle, index ) => {
        const t = ( phase + index / wasteParticles.length ) % 1;
        particle.centerX = 138 - t * 52;
        particle.centerY = 75 + t * 25;
      } );
    } );

    this.addChild( new Text( 'Simplified model: relative indicators show selected relationships, not real cell measurements.', {
      font: new PhetFont( 9 ), fill: '#536A73', centerX: this.layoutBounds.centerX,
      bottom: this.layoutBounds.maxY - 5, maxWidth: viewWidth - 80
    } ) );

    this.addChild( new ResetAllButton( {
      listener: () => model.reset(), right: this.layoutBounds.maxX - 13,
      bottom: this.layoutBounds.maxY - 12
    } ) );

    renderLeft();
    renderRight();
  }
}

export default AnimalCellScreenView;
