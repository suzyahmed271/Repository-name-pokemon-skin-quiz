// Copyright 2015-2026, University of Colorado Boulder

/**
 * Interactive systems-lab view for the Animal Cell simulation.
 *
 * @author Suzan Ahmed Mustafa
 */

import Dimension2 from '../../../dot/js/Dimension2.js';
import Range from '../../../dot/js/Range.js';
import { roundSymmetric } from '../../../dot/js/util/roundSymmetric.js';
import ScreenView from '../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Circle from '../../../scenery/js/nodes/Circle.js';
import Node from '../../../scenery/js/nodes/Node.js';
import Path from '../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../scenery/js/nodes/Text.js';
import HBox from '../../../scenery/js/layout/nodes/HBox.js';
import FireListener from '../../../scenery/js/listeners/FireListener.js';
import Shape from '../../../kite/js/Shape.js';
import Vector2 from '../../../dot/js/Vector2.js';
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
  [ 'Cell health indicator', 'health', '#4DA66B' ],
  [ 'Oxygen level', 'oxygen', '#4EB5D3' ],
  [ 'Glucose level', 'glucose', '#D89B3E' ],
  [ 'Protein export', 'export', '#D15A9F' ],
  [ 'Membrane transport', 'transport', '#39AFC2' ],
  [ 'Internal balance', 'balance', '#39A887' ],
  [ 'Cell stress', 'stress', '#CE6744' ]
];

const metricProperty = ( model, key ) => model.variables[ key ] || model[ key + 'Property' ];
const readableFont = size => new PhetFont( Math.max( 16, size * 1.18 ) );
const readableBoldFont = size => new PhetFont( { size: Math.max( 18, size * 1.18 ), weight: 'bold' } );

class AnimalCellScreenView extends ScreenView {
  constructor( model ) {
    super();

    const viewWidth = this.layoutBounds.width;
    const leftX = 12;
    const panelTop = 126;
    const panelHeight = Math.min( 490, this.layoutBounds.height - 154 );
    const sideWidth = 276;
    const rightX = this.layoutBounds.maxX - sideWidth - 12;

    const title = new Text( 'Animal Cell Interactive Systems Lab', {
      font: new PhetFont( { size: 26, weight: 'bold' } ),
      fill: '#125F7B', centerX: this.layoutBounds.centerX, top: 8,
      maxWidth: viewWidth - 24
    } );
    this.addChild( title );
    this.addChild( new Text( 'Explore a simplified model: change one condition, follow the evidence, explain the result.', {
      font: readableFont( 13 ), fill: '#486C7A', centerX: this.layoutBounds.centerX,
      top: title.bottom + 2, maxWidth: viewWidth - 30
    } ) );

    const modeItems = [
      [ 'Learn', 'learn', '#61D1EA' ],
      [ 'Explore', 'explore', '#8DD7F1' ],
      [ 'What Happens If?', 'whatif', '#FFB5D9' ],
      [ 'Rescue the Cell', 'challenge', '#FFE080' ]
    ];
    const modeButtons = modeItems.map( item => new RectangularPushButton( {
      content: new Text( item[ 0 ], { font: readableFont( 14 ) } ),
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
          model.experimentPanelProperty.value = 'controls';
          trialPanelPage = 'design';
          model.startTrial();
          model.rightPanelProperty.value = 'notebook';
          renderLeft();
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

    const organelleNodes = {};
    const organelleShapes = {};
    const createOrganelle = key => {
      const data = INFO[ key ];
      const [ x, y ] = data.position;
      const parts = [];
      const addPart = part => {
        parts.push( part );
        return part;
      };
      if ( key === 'mitochondria' ) {
        addPart( new Rectangle( -39, -20, 78, 40, 20, 20, {
          fill: data.color, stroke: '#34505C', lineWidth: 2
        } ) );
        [ -10, 0, 10 ].forEach( foldY => {
          addPart( new Rectangle( -18, foldY - 1.5, 36, 3, 1.5, 1.5, {
            fill: '#AD512F', rotation: foldY / 35
          } ) );
        } );
      }
      else if ( key === 'golgi' ) {
        [ -15, -5, 5, 15 ].forEach( ( stackY, index ) => {
          addPart( new Rectangle( -31 + index % 2 * 4, stackY - 4, 62 - index % 2 * 8, 8, 4, 4, {
            fill: data.color, stroke: '#8D3568', lineWidth: 1.5
          } ) );
        } );
      }
      else if ( key === 'roughER' || key === 'smoothER' ) {
        [ -17, -5, 7, 19 ].forEach( ( tubeY, index ) => {
          addPart( new Rectangle( -31 + ( index % 2 ) * 7, tubeY, 62 - ( index % 2 ) * 14, 5, 2.5, 2.5, {
            fill: data.color, stroke: key === 'roughER' ? '#287A91' : '#328A68', lineWidth: 1.5,
            rotation: index % 2 ? 0.18 : -0.12
          } ) );
        } );
        if ( key === 'roughER' ) {
          [ -22, -8, 8, 22 ].forEach( dotX => {
            addPart( new Circle( 2.5, { fill: '#5A4933', centerX: dotX, centerY: -20 } ) );
            addPart( new Circle( 2.5, { fill: '#5A4933', centerX: dotX, centerY: 27 } ) );
          } );
        }
      }
      else if ( key === 'ribosomes' ) {
        addPart( new Circle( data.radius, { fill: data.color, opacity: 0.015, stroke: null } ) );
        [ [ -15, -11 ], [ 0, -16 ], [ 14, -9 ], [ -20, 4 ], [ -4, 1 ], [ 12, 5 ], [ -12, 17 ], [ 5, 18 ], [ 21, 16 ] ].forEach( point => {
          addPart( new Circle( 5, { fill: data.color, stroke: '#8E6925', lineWidth: 1, centerX: point[ 0 ], centerY: point[ 1 ] } ) );
        } );
      }
      else if ( key === 'cytoskeleton' ) {
        [ [ -18, -5, 36, 4, 0.45 ], [ -17, 2, 34, 4, -0.45 ], [ -15, 9, 30, 4, 0.2 ] ].forEach( item => {
          addPart( new Rectangle( item[ 0 ], item[ 1 ], item[ 2 ], item[ 3 ], {
            fill: data.color, stroke: '#315E70', lineWidth: 1, rotation: item[ 4 ]
          } ) );
        } );
      }
      else if ( key === 'centrosome' ) {
        addPart( new Rectangle( -16, -5, 32, 10, 5, 5, { fill: data.color, stroke: '#8A6825', lineWidth: 1.5, rotation: 0.8 } ) );
        addPart( new Rectangle( -5, -16, 10, 32, 5, 5, { fill: data.color, stroke: '#8A6825', lineWidth: 1.5, rotation: -0.8 } ) );
      }
      else {
        addPart( new Circle( data.radius, {
          fill: data.color, stroke: '#34505C', lineWidth: 2
        } ) );
      }
      const labelText = key === 'centrosome' ? 'Centrosome' : key === 'cytoskeleton' ? 'Filaments' : key === 'golgi' ? 'Golgi' : data.name;
      const label = new Text( labelText, {
        font: readableBoldFont( key === 'cytoskeleton' ? 9 : 10 ),
        fill: '#153248', maxWidth: Math.max( 60, data.radius * 2.8 ),
        centerX: 0, centerY: key === 'nucleolus' ? 27 : 0, pickable: false
      } );
      const node = new Node( { children: [ ...parts, label ], x: x, y: y, cursor: 'pointer' } );
      node.addInputListener( new FireListener( { fire: () => {
        model.selectedOrganelleProperty.value = key;
        model.rightPanelProperty.value = 'organelle';
      } } ) );
      organelleNodes[ key ] = node;
      organelleShapes[ key ] = parts.filter( part => part.stroke !== null );
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
    const golgiBacklogParticles = [ 0, 1, 2, 3, 4 ].map( index => {
      const particle = new Circle( 4, {
        fill: '#E14D9B', stroke: '#8A2257', lineWidth: 1,
        centerX: 66 + index % 3 * 10, centerY: -77 + Math.floor( index / 3 ) * 10,
        visible: false
      } );
      cellRoot.addChild( particle );
      return particle;
    } );
    const membraneParticles = [ 0, 1, 2 ].map( () => {
      const particle = new Circle( 3, { fill: '#2E9DB6', stroke: '#176A81', lineWidth: 1 } );
      cellRoot.addChild( particle );
      return particle;
    } );
    cellRoot.scale = Math.min( 0.93, ( panelHeight - 88 ) / 388 );
    cellRoot.centerX = this.layoutBounds.centerX;
    cellRoot.centerY = panelTop + panelHeight * 0.47;

    const flowCaption = new Text( 'Ribosome → rough ER → Golgi → vesicle → membrane', {
      font: readableFont( 11 ), fill: '#345D6C', centerX: this.layoutBounds.centerX,
      top: panelTop + panelHeight - 34, maxWidth: 455
    } );
    const energyCaption = new Text( 'Glucose + oxygen → mitochondria → usable ATP', {
      font: readableFont( 11 ), fill: '#345D6C', centerX: this.layoutBounds.centerX,
      top: flowCaption.bottom + 2, maxWidth: 455
    } );
    this.addChild( flowCaption );
    this.addChild( energyCaption );

    const leftContent = new Node();
    const rightContent = new Node();
    this.addChild( leftContent );
    this.addChild( rightContent );
    let activeExploreQuestion = null;
    let trialPanelPage = 'design';
    const runCurrentTrial = () => {
      const definition = AnimalCellModel.VARIABLE_DEFINITIONS.find( item => item.key === model.selectedVariableProperty.value ) || AnimalCellModel.VARIABLE_DEFINITIONS[ 0 ];
      trialPanelPage = 'records';
      model.comparePrediction( definition.outputKey );
      model.recordTrial();
      model.rightPanelProperty.value = 'notebook';
    };

    const makeButton = ( label, listener, color = '#DDF3FA', size = 12 ) => new RectangularPushButton( {
      content: new Text( label, { font: readableFont( size ), maxWidth: sideWidth - 26 } ),
      baseColor: color, listener: listener
    } );
    const addPanelTitle = ( root, text, x, y ) => root.addChild( new Text( text, {
      font: readableBoldFont( 18 ), fill: '#125F7B',
      left: x + 14, top: y + 12, maxWidth: sideWidth - 28
    } ) );

    const renderLeft = () => {
      leftContent.removeAllChildren();
      const mode = model.modeProperty.value;
      const titleText = mode === 'whatif' ? 'Experiment lab' : mode === 'challenge' ? 'Rescue the Cell' : mode === 'explore' ? 'Explore & test' : 'Learn the system';
      addPanelTitle( leftContent, titleText, leftX, panelTop );
      if ( mode === 'explore' ) {
        leftContent.addChild( new Text( 'Adjust one input; follow ATP, waste, and cell health.', {
          font: readableFont( 9 ), fill: '#294957', left: leftX + 14, top: panelTop + 43, maxWidth: sideWidth - 28
        } ) );
        const runButton = makeButton( 'RUN TRIAL', () => {
          runCurrentTrial();
        }, '#FFE8A3', 12 );
        runButton.left = leftX + 14;
        runButton.bottom = panelTop + panelHeight - 8;
        leftContent.addChild( runButton );
        renderSliders( mode );
        return;
      }
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
          font: readableFont( 13 ), fill: '#435E69', maxWidth: sideWidth - 28,
          left: leftX + 14, top: tabs.bottom + 15
        } );
        leftContent.addChild( learnText );
        leftContent.addChild( makeButton( 'Open organelle details', () => {
          model.rightPanelProperty.value = 'organelle';
        }, '#BFEAF2', 12 ).mutate( { left: leftX + 14, top: learnText.bottom + 15 } ) );
        const modelNote = new Text( 'Model note: cells use RNA messages between DNA instructions and ribosomes. Pathways here are simplified for learning.', {
          font: readableFont( 11 ), fill: '#5A6570', maxWidth: sideWidth - 28,
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
          font: readableFont( 12 ), fill: '#435E69', maxWidth: sideWidth - 28,
          left: leftX + 14, top: taskTop
        } );
        leftContent.addChild( clueText );
        const feedback = new Text( model.challengeFeedbackProperty.value, {
          font: readableFont( 11 ), fill: '#355967', maxWidth: sideWidth - 28,
          left: leftX + 14, top: clueText.bottom + 11
        } );
        leftContent.addChild( feedback );
        leftContent.addChild( makeButton( 'Start / restart rescue case', () => model.startRescueChallenge(), '#FFE080', 11 ).mutate( { left: leftX + 14, top: feedback.bottom + 11 } ) );
        leftContent.addChild( makeButton( 'Test whether the cell is rescued', () => model.testRescue(), '#A9E7C2', 11 ).mutate( { left: leftX + 14, top: feedback.bottom + 53 } ) );
        const hintText = new Text( model.hintsEnabledProperty.value ? model.supportMessageProperty.value : 'Hints are off in Teacher Mode.', {
          font: readableFont( 10 ), fill: '#58656B', maxWidth: sideWidth - 28,
          left: leftX + 14, top: feedback.bottom + 102
        } );
        leftContent.addChild( hintText );
      }
      else if ( mode === 'challenge' ) {
        const instruction = new Text( 'Use the controls below to change a suspected cause, then return to Diagnose and test whether the cell recovered.', {
          font: readableFont( 11 ), fill: '#435E69', maxWidth: sideWidth - 28,
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
          font: readableFont( 12 ), fill: '#435E69', maxWidth: sideWidth - 28,
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
          font: readableFont( 10 ), fill: '#435E69', left: leftX + 14, top: nextButton.bottom + 9
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
          font: readableFont( 10 ), fill: '#3F6873', maxWidth: sideWidth - 28,
          left: leftX + 14, top: runButton.bottom + 8
        } );
        leftContent.addChild( feedback );
        const supportText = new Text( model.hintsEnabledProperty.value ? model.supportMessageProperty.value : 'Hints are off in Teacher Mode.', {
          font: readableFont( 9 ), fill: '#58656B', maxWidth: sideWidth - 28,
          left: leftX + 14, top: feedback.bottom + 4
        } );
        leftContent.addChild( supportText );
        const controlsLabel = new Text( 'Adjust a control below, then compare the data. Keep other conditions steady.', {
          font: readableFont( 10 ), fill: '#536A73', maxWidth: sideWidth - 28,
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
          font: readableFont( 11 ), fill: '#435E69', maxWidth: sideWidth - 28,
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
          font: readableFont( 11 ), fill: '#435E69', maxWidth: sideWidth - 28,
          left: leftX + 14, top: taskTop
        } );
        leftContent.addChild( prompts );
        leftContent.addChild( makeButton( 'Begin exploring variables', () => {
          model.experimentPanelProperty.value = 'controls';
          renderLeft();
        }, '#BFEAF2', 10 ).mutate( { left: leftX + 14, top: prompts.bottom + 8 } ) );
        leftContent.addChild( makeButton( 'Reset healthy cell', () => model.resetCell(), '#F2E6CA', 9 ).mutate( { left: leftX + 14, top: prompts.bottom + 42 } ) );
      }
      else if ( mode === 'explore' ) {
        const currentDefinition = AnimalCellModel.VARIABLE_DEFINITIONS.find( item => item.key === model.selectedVariableProperty.value ) || AnimalCellModel.VARIABLE_DEFINITIONS[ 0 ];
        const workflow = new Text( 'QUESTION → PREDICT → CHANGE → RUN\nOBSERVE → EXPLAIN', {
          font: readableBoldFont( 9 ), fill: '#125F7B', maxWidth: sideWidth - 28,
          left: leftX + 14, top: taskTop
        } );
        leftContent.addChild( workflow );
        activeExploreQuestion = new Text( '', {
          font: readableFont( 10 ), fill: '#435E69', maxWidth: sideWidth - 28,
          left: leftX + 14, top: workflow.bottom + 3
        } );
        activeExploreQuestion.string = 'How does ' + currentDefinition.label.toLowerCase() + ' affect ' + currentDefinition.output + '?';
        leftContent.addChild( activeExploreQuestion );
        const predictLabel = new Text( 'Make a prediction, then change one control:', {
          font: readableFont( 9 ), fill: '#435E69', left: leftX + 14,
          top: activeExploreQuestion.bottom + 3
        } );
        leftContent.addChild( predictLabel );
        const predictionRow = new HBox( {
          children: [ 'increase', 'decrease', 'stay the same' ].map( direction => makeButton( direction, () => {
            model.makePrediction( direction );
          }, model.predictionProperty.value === direction ? '#B5E8C0' : '#EAF5F8', 8 ) ),
          spacing: 2, left: leftX + 8, top: predictLabel.bottom + 2
        } );
        leftContent.addChild( predictionRow );
        const actions = new HBox( {
          children: [
            makeButton( 'Run trial', () => {
              const definition = AnimalCellModel.VARIABLE_DEFINITIONS.find( item => item.key === model.selectedVariableProperty.value ) || currentDefinition;
              model.comparePrediction( definition.outputKey );
              renderLeft();
            }, '#FFE8A3', 9 ),
            makeButton( 'Save trial', () => {
              model.recordTrial();
              model.rightPanelProperty.value = 'notebook';
              renderRight();
            }, '#BCEACB', 9 )
          ],
          spacing: 4, left: leftX + 10, top: predictionRow.bottom + 3
        } );
        leftContent.addChild( actions );
      }
      else {
        const supportMessage = model.hintsEnabledProperty.value ? model.supportMessageProperty.value : 'Hints are off in Teacher Mode.';
        const support = new Text( model.supportLevelProperty.value + ': ' + supportMessage, {
          font: readableFont( 9 ), fill: '#435E69', maxWidth: sideWidth - 28,
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
      const exploreKeys = [ 'oxygen', 'glucose', 'water', 'ph', 'temperature', 'mitochondria', 'ribosomes', 'golgi', 'lysosomes', 'permeability' ];
      const definitions = mode === 'explore' ? exploreKeys.map( key => AnimalCellModel.VARIABLE_DEFINITIONS.find( item => item.key === key ) ) : model.getDefinitions( model.controlGroupProperty.value );
      const allowed = new Set( model.enabledVariablesProperty.value );
      const visibleDefinitions = definitions.filter( definition => allowed.has( definition.key ) );
      const startY = mode === 'explore' ? panelTop + 84 : panelTop + 190;
      const rowHeight = mode === 'explore' ? ( panelTop + panelHeight - startY - 48 ) / Math.max( visibleDefinitions.length, 1 ) : Math.min( 60, ( panelTop + panelHeight - startY - 8 ) / Math.max( visibleDefinitions.length, 1 ) );
      visibleDefinitions.forEach( ( definition, index ) => {
        const y = startY + index * rowHeight;
        const label = new Text( definition.label, {
          font: readableFont( mode === 'explore' ? 9 : 10 ), fill: '#183A4B', left: leftX + 12, top: y,
          maxWidth: sideWidth - 65
        } );
        const value = new Text( '', {
          font: readableBoldFont( 10 ), fill: '#125F7B',
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
          trackSize: new Dimension2( sideWidth - 68, 4 ),
          thumbSize: new Dimension2( 16, mode === 'explore' ? 14 : 24 ),
          constrainValue: input => roundSymmetric( input / 5 ) * 5
        } );
        slider.left = leftX + 12;
        slider.top = mode === 'explore' ? y + 18 : label.bottom + 3;
        if ( mode !== 'explore' ) {
          sliderRoot.addChild( new Text( 'Affects: ' + definition.output, {
            font: readableFont( 8 ), fill: '#526A73', left: leftX + 12,
            top: slider.bottom + 1, maxWidth: sideWidth - 24
          } ) );
        }
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
        [ 'Data', 'data' ], [ 'Graphs', 'graphs' ], [ 'Trials', 'notebook' ], [ 'Teacher', 'teacher' ]
      ].map( item => makeButton( item[ 0 ], () => {
        model.rightPanelProperty.value = item[ 1 ];
        renderRight();
      }, model.rightPanelProperty.value === item[ 1 ] ? '#9EE2F0' : '#EAF5F8', 9 ) );
      const tabRow = new HBox( { children: tabs, spacing: 2, left: rightX + 8, top: panelTop + 7 } );
      rightContent.addChild( tabRow );
      const panelMode = model.rightPanelProperty.value;

      if ( panelMode === 'data' ) {
        rightContent.addChild( new Text( 'Live Cell Data', {
          font: readableBoldFont( 17 ), fill: '#125F7B',
          left: rightX + 13, top: tabRow.bottom + 8
        } ) );
        METRICS.forEach( ( metric, index ) => {
          const y = tabRow.bottom + 36 + index * 34;
          const label = new Text( metric[ 0 ], {
            font: readableFont( 9 ), fill: '#294957', left: rightX + 13, top: y, maxWidth: sideWidth - 88
          } );
          const number = new Text( '', {
            font: readableBoldFont( 10 ), fill: '#173A4A',
            right: rightX + sideWidth - 12, top: y
          } );
          const back = new Rectangle( 0, 0, sideWidth - 26, 8, 4, 4, {
            fill: '#E2EAED', left: rightX + 13, top: y + 20
          } );
          const bar = new Rectangle( 0, 0, 1, 8, 4, 4, {
            fill: metric[ 2 ], left: rightX + 13, top: y + 20
          } );
          const property = metricProperty( model, metric[ 1 ] );
          const updateMetric = current => {
            number.string = roundSymmetric( current ) + '%';
            bar.scaleX = Math.max( 0.01, current / 100 );
          };
          updateMetric( property.value );
          linkPanelProperty( property, updateMetric );
          rightContent.addChild( label );
          rightContent.addChild( number );
          rightContent.addChild( back );
          rightContent.addChild( bar );
        } );
      }
      else if ( panelMode === 'graphs' ) {
        addPanelTitle( rightContent, 'Live trends · last 30 seconds', rightX, tabRow.bottom + 1 );
        const graphSpecs = [ [ 'atp', 'ATP', '#D58A14' ], [ 'health', 'Cell health', '#35925D' ], [ 'waste', 'Waste buildup', '#C55043' ] ];
        graphSpecs.forEach( ( spec, graphIndex ) => {
          const graphLeft = rightX + 42;
          const graphTop = tabRow.bottom + 57 + graphIndex * 128;
          const graphWidth = sideWidth - 62;
          const graphHeight = 82;
          rightContent.addChild( new Text( spec[ 1 ], {
            font: readableBoldFont( 10 ), fill: '#294957', left: rightX + 14, top: graphTop - 25
          } ) );
          rightContent.addChild( new Text( '100', {
            font: readableFont( 8 ), fill: '#536A73', right: graphLeft - 5, top: graphTop - 7
          } ) );
          rightContent.addChild( new Text( '0', {
            font: readableFont( 8 ), fill: '#536A73', right: graphLeft - 5, bottom: graphTop + graphHeight + 3
          } ) );
          rightContent.addChild( new Text( '30 s ago', {
            font: readableFont( 8 ), fill: '#536A73', left: graphLeft, top: graphTop + graphHeight + 4
          } ) );
          rightContent.addChild( new Text( 'now', {
            font: readableFont( 8 ), fill: '#536A73', right: graphLeft + graphWidth, top: graphTop + graphHeight + 4
          } ) );
          const verticalAxis = new Path( Shape.lineSegment( new Vector2( graphLeft, graphTop ), new Vector2( graphLeft, graphTop + graphHeight ) ), {
            stroke: '#78909A', lineWidth: 1.5
          } );
          const horizontalAxis = new Path( Shape.lineSegment( new Vector2( graphLeft, graphTop + graphHeight ), new Vector2( graphLeft + graphWidth, graphTop + graphHeight ) ), {
            stroke: '#78909A', lineWidth: 1.5
          } );
          const trace = new Path( new Shape(), { stroke: spec[ 2 ], lineWidth: 3, fill: null } );
          rightContent.addChild( verticalAxis );
          rightContent.addChild( horizontalAxis );
          rightContent.addChild( trace );
          const redraw = samples => {
            const visibleSamples = samples.slice( -60 );
            const points = visibleSamples.map( ( sample, index ) => new Vector2(
              graphLeft + ( index + 60 - visibleSamples.length ) / 59 * graphWidth,
              graphTop + graphHeight - sample[ spec[ 0 ] ] / 100 * graphHeight
            ) );
            const graphShape = new Shape();
            if ( points.length ) {
              graphShape.moveToPoint( points[ 0 ] );
              points.slice( 1 ).forEach( point => {
                graphShape.lineToPoint( point );
              } );
            }
            trace.shape = graphShape;
          };
          redraw( model.historyProperty.value );
          linkPanelProperty( model.historyProperty, redraw );
        } );
      }
      else if ( panelMode === 'organelle' ) {
        const data = INFO[ model.selectedOrganelleProperty.value ];
        addPanelTitle( rightContent, data.name, rightX, tabRow.bottom + 1 );
        const details = [ 'Function: ' + data.job, 'Connects to: ' + data.connects, 'If reduced: ' + data.failure ];
        let y = tabRow.bottom + 37;
        details.forEach( text => {
          const description = new Text( text, {
            font: readableFont( 11 ), fill: '#294957', maxWidth: sideWidth - 26,
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
        addPanelTitle( rightContent, 'Trial comparison', rightX, tabRow.bottom + 1 );
        const pageTabs = new HBox( {
          children: [ [ 'Design', 'design' ], [ 'Saved trials', 'records' ] ].map( item => makeButton( item[ 0 ], () => {
            trialPanelPage = item[ 1 ];
            renderRight();
          }, trialPanelPage === item[ 1 ] ? '#9EE2F0' : '#EAF5F8', 9 ) ),
          spacing: 4, left: rightX + 8, top: tabRow.bottom + 2
        } );
        rightContent.addChild( pageTabs );
        if ( trialPanelPage === 'design' ) {
          const designText = new Text( '', {
            font: readableFont( 9 ), fill: '#294957', maxWidth: sideWidth - 26,
            left: rightX + 13, top: pageTabs.bottom + 6
          } );
          const updateDesignText = () => {
            const definition = AnimalCellModel.VARIABLE_DEFINITIONS.find( item => item.key === model.selectedVariableProperty.value ) || AnimalCellModel.VARIABLE_DEFINITIONS[ 0 ];
            designText.string = 'Question: How does ' + definition.label.toLowerCase() + ' affect ' + definition.output + '?\nIndependent variable: ' + definition.label + '\nDependent variable: ' + definition.output + '\nControlled variables: other inputs stay fixed.';
          };
          updateDesignText();
          linkPanelProperty( model.selectedVariableProperty, updateDesignText );
          rightContent.addChild( designText );
          const predictionLabel = new Text( 'Prediction', {
            font: readableBoldFont( 10 ), fill: '#294957', left: rightX + 13, top: designText.bottom + 4
          } );
          rightContent.addChild( predictionLabel );
          const predictionRow = new HBox( {
            children: [ [ 'Increase', 'increase' ], [ 'Decrease', 'decrease' ], [ 'No change', 'stay the same' ] ].map( item => makeButton( item[ 0 ], () => {
              model.makePrediction( item[ 1 ] );
              renderRight();
            }, model.predictionProperty.value === item[ 1 ] ? '#B5E8C0' : '#EAF5F8', 9 ) ),
            spacing: 3, left: rightX + 7, top: predictionLabel.bottom + 3
          } );
          rightContent.addChild( predictionRow );
          rightContent.addChild( new Text( 'Adjust the selected input. Wait for the trends, then choose RUN TRIAL.', {
            font: readableFont( 9 ), fill: '#294957', maxWidth: sideWidth - 26,
            left: rightX + 13, top: predictionRow.bottom + 8
          } ) );
          const resetButton = makeButton( 'RESET TO HEALTHY CELL', () => model.resetToHealthyCell(), '#BCEACB', 10 );
          resetButton.left = rightX + 13;
          resetButton.bottom = panelTop + panelHeight - 8;
          rightContent.addChild( resetButton );
        }
        else {
        const recentTrials = model.trialsProperty.value.slice( -5 );
        const note = new Text( 'Select two trials to compare. Five recent trials are shown.', {
          font: readableFont( 9 ), fill: '#294957', maxWidth: sideWidth - 26,
          left: rightX + 13, top: tabRow.bottom + 34
        } );
        rightContent.addChild( note );
        let y = note.bottom + 5;
        const tableHeader = new Text( 'TRIAL / INPUT       ATP · P · W · HEALTH', {
          font: readableBoldFont( 8 ), fill: '#125F7B', left: rightX + 13, top: y
        } );
        rightContent.addChild( tableHeader );
        y = tableHeader.bottom + 3;
        recentTrials.forEach( trial => {
          const selected = model.selectedTrialsProperty.value.includes( trial.number );
          const row = new Text( ( selected ? '☑ ' : '□ ' ) + '#' + trial.number + ' · ' + trial.independentVariable + ' ' + trial.value + '%\n' + roundSymmetric( trial.atp ) + ' · ' + roundSymmetric( trial.protein ) + ' · ' + roundSymmetric( trial.waste ) + ' · ' + roundSymmetric( trial.cellHealth ), {
            font: readableFont( 8 ), fill: selected ? '#125F7B' : '#294957', maxWidth: sideWidth - 26,
            left: rightX + 13, top: y, cursor: 'pointer'
          } );
          row.addInputListener( new FireListener( { fire: () => {
            const selectedNumbers = model.selectedTrialsProperty.value;
            model.selectedTrialsProperty.value = selected ? selectedNumbers.filter( number => number !== trial.number ) : [ ...selectedNumbers, trial.number ].slice( -2 );
          } } ) );
          rightContent.addChild( row );
          y = row.bottom + 2;
        } );
        const selectedTrials = model.selectedTrialsProperty.value.map( number => model.trialsProperty.value.find( trial => trial.number === number ) ).filter( Boolean );
        if ( selectedTrials.length ) {
          const observation = new Text( 'Observation · Trial #' + selectedTrials[ 0 ].number + ': ' + selectedTrials[ 0 ].observation, {
            font: readableFont( 8 ), fill: '#294957', maxWidth: sideWidth - 26,
            left: rightX + 13, top: Math.min( y + 2, panelTop + panelHeight - 146 )
          } );
          rightContent.addChild( observation );
          y = observation.bottom + 2;
        }
        if ( selectedTrials.length >= 2 ) {
          const pair = selectedTrials.slice( -2 );
          const evidence = new Text( 'Evidence: does the input difference align with ATP and cell health?', {
            font: readableBoldFont( 8 ), fill: '#125F7B', maxWidth: sideWidth - 26,
            left: rightX + 13, top: Math.min( y + 3, panelTop + panelHeight - 104 )
          } );
          rightContent.addChild( evidence );
          [ [ 'ATP', 'atp', '#D58A14' ], [ 'Health', 'cellHealth', '#35925D' ] ].forEach( ( metric, index ) => {
            const chartY = evidence.bottom + 2 + index * 24;
            const label = new Text( metric[ 0 ] + ' · #' + pair[ 0 ].number + ': ' + roundSymmetric( pair[ 0 ][ metric[ 1 ] ] ) + '   #' + pair[ 1 ].number + ': ' + roundSymmetric( pair[ 1 ][ metric[ 1 ] ] ), {
              font: readableFont( 8 ), fill: '#294957', left: rightX + 13, top: chartY
            } );
            const firstBar = new Rectangle( 0, 0, Math.max( 2, pair[ 0 ][ metric[ 1 ] ] * 0.65 ), 7, {
              fill: metric[ 2 ], left: rightX + 13, top: label.bottom + 1
            } );
            const secondBar = new Rectangle( 0, 0, Math.max( 2, pair[ 1 ][ metric[ 1 ] ] * 0.65 ), 7, {
              fill: '#91B7C5', left: rightX + 13, top: label.bottom + 9
            } );
            rightContent.addChild( label );
            rightContent.addChild( firstBar );
            rightContent.addChild( secondBar );
          } );
        }
        const healthyButton = makeButton( 'RESET TO HEALTHY CELL', () => model.resetToHealthyCell(), '#BCEACB', 10 );
        healthyButton.left = rightX + 13;
        healthyButton.bottom = panelTop + panelHeight - 8;
        rightContent.addChild( healthyButton );
        }
      }
      else {
        renderTeacherPanel( rightContent, tabRow );
      }
    };

    let teacherPage = 0;
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
          font: readableFont( 10 ), fill: '#526A73', maxWidth: sideWidth - 26,
          left: rightX + 13, top: toggle.bottom + 8
        } ) );
        return;
      }
      const groupToggle = makeButton( model.teacherListProperty.value === 'variables' ? 'Choose variables' : 'Choose cell structures', () => {
        model.teacherListProperty.value = model.teacherListProperty.value === 'variables' ? 'organelles' : 'variables';
        teacherPage = 0;
        renderRight();
      }, '#DCEEF4', 9 );
      groupToggle.left = rightX + 13;
      groupToggle.top = toggle.bottom + 5;
      root.addChild( groupToggle );
      const names = model.teacherListProperty.value === 'variables' ?
                    AnimalCellModel.VARIABLE_DEFINITIONS.map( item => [ item.key, item.label ] ) :
                    Object.keys( INFO ).map( key => [ key, INFO[ key ].name ] );
      const enabled = model.teacherListProperty.value === 'variables' ? model.enabledVariablesProperty : model.enabledOrganellesProperty;
      const pageCount = Math.ceil( names.length / 7 );
      const pageButton = makeButton( 'Page ' + ( teacherPage + 1 ) + ' of ' + pageCount + ' · More', () => {
        teacherPage = ( teacherPage + 1 ) % pageCount;
        renderRight();
      }, '#EAF5F8', 9 );
      pageButton.left = rightX + 13;
      pageButton.top = groupToggle.bottom + 4;
      root.addChild( pageButton );
      names.slice( teacherPage * 7, teacherPage * 7 + 7 ).forEach( ( item, index ) => {
        const isEnabled = enabled.value.includes( item[ 0 ] );
        const row = new Text( ( isEnabled ? '✓ ' : '□ ' ) + item[ 1 ], {
          font: readableFont( 9 ), fill: isEnabled ? '#235B3D' : '#785454',
          left: rightX + 15, top: pageButton.bottom + 3 + index * 29,
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
        organelleShapes[ orgKey ].forEach( shape => {
          shape.lineWidth = orgKey === key ? 3 : 1.5;
          shape.stroke = orgKey === key ? '#102D3A' : '#34505C';
        } );
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
    model.selectedTrialsProperty.link( () => {
      if ( model.rightPanelProperty.value === 'notebook' ) {
        renderRight();
      }
    } );
    model.selectedTrialsProperty.link( () => {
      if ( model.rightPanelProperty.value === 'notebook' ) {
        renderRight();
      }
    } );
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
      mitochondria: 'mitochondria', ribosomes: 'ribosomes', roughER: 'roughER',
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
      energyParticles.forEach( ( particle, index ) => {
        particle.opacity = Math.min( 1, 0.2 + atp / 125 );
        particle.visible = atp > index * 28;
      } );
    } );
    model.proteinProperty.link( protein => {
      organelleNodes.ribosomes.scale = 0.86 + protein / 360;
      proteinParticles.forEach( ( particle, index ) => {
        particle.opacity = Math.min( 1, 0.18 + protein / 120 );
        particle.visible = protein > index * 28;
      } );
    } );
    model.wasteProperty.link( waste => {
      wasteParticles.forEach( particle => { particle.opacity = Math.min( 1, 0.18 + waste / 115 ); } );
      wasteBuildup.forEach( ( particle, index ) => {
        particle.visible = waste > 30 + index * 10;
      } );
    } );
    model.transportProperty.link( transport => {
      organelleNodes.vesicles.opacity = Math.min( 1, 0.25 + transport / 130 );
      membraneParticles.forEach( ( particle, index ) => {
        particle.opacity = Math.min( 1, 0.2 + transport / 125 );
        particle.visible = transport > index * 26;
      } );
    } );
    model.golgiBacklogProperty.link( backlog => {
      golgiBacklogParticles.forEach( ( particle, index ) => {
        particle.visible = backlog > index * 14 + 8;
      } );
    } );
    model.flowPhaseProperty.link( phase => {
      const proteinPath = [ [ -150, 28 ], [ -87, 89 ], [ 97, -63 ], [ 149, 66 ], [ 185, 4 ] ];
      const golgiFunction = model.variables.golgi.value;
      proteinParticles.forEach( ( particle, index ) => {
        let t = ( phase + index / proteinParticles.length ) % 1;
        if ( golgiFunction < 95 && t > 0.47 ) {
          t = 0.47;
        }
        const pathPosition = t * ( proteinPath.length - 1 );
        const segment = Math.min( proteinPath.length - 2, Math.floor( pathPosition ) );
        const segmentProgress = pathPosition - segment;
        particle.centerX = proteinPath[ segment ][ 0 ] + ( proteinPath[ segment + 1 ][ 0 ] - proteinPath[ segment ][ 0 ] ) * segmentProgress;
        particle.centerY = proteinPath[ segment ][ 1 ] + ( proteinPath[ segment + 1 ][ 1 ] - proteinPath[ segment ][ 1 ] ) * segmentProgress;
      } );
      energyParticles.forEach( ( particle, index ) => {
        const energyTargets = [ [ -150, 28 ], [ 50, 24 ], [ 149, 66 ] ];
        const t = ( phase + index / energyParticles.length ) % 1;
        const target = energyTargets[ index ];
        particle.centerX = -132 + ( target[ 0 ] + 132 ) * t;
        particle.centerY = -70 + ( target[ 1 ] + 70 ) * t;
      } );
      wasteParticles.forEach( ( particle, index ) => {
        const t = ( phase + index / wasteParticles.length ) % 1;
        particle.centerX = 138 - t * 52;
        particle.centerY = 75 + t * 25;
      } );
      membraneParticles.forEach( ( particle, index ) => {
        const t = ( phase * 2 + index / membraneParticles.length ) % 1;
        particle.centerX = -174 + t * 348;
        particle.centerY = 4 + Math.sin( t * Math.PI * 2 ) * 72;
      } );
      organelleNodes.mitochondria.scale = 0.88 + model.atpProperty.value / 400 + Math.sin( phase * Math.PI * 2 ) * model.variables.mitochondria.value / 1800;
    } );

    this.addChild( new Text( 'Simplified model: relative indicators show selected relationships, not real cell measurements.', {
      font: readableFont( 9 ), fill: '#536A73', centerX: this.layoutBounds.centerX,
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
