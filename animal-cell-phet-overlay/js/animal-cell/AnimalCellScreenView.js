// Copyright 2015-2026, University of Colorado Boulder

/**
 * View for the Animal Cell Systems Lab.
 *
 * @author Suzan Ahmed Mustafa
 */

/* eslint-env es6 */

import ScreenView from '../../../../joist/js/ScreenView.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/layout/nodes/VBox.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import FireListener from '../../../../scenery/js/listeners/FireListener.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';

const INFO = {
  membrane: {
    name: 'Cell Membrane',
    color: '#6FE7F5',
    job: 'Controls what enters and leaves the cell and helps maintain stable internal conditions.',
    analogy: 'Think of it as a smart security gate.',
    team: 'Works with vesicles and cytoplasm.'
  },
  cytoplasm: {
    name: 'Cytoplasm',
    color: '#C9F4FF',
    job: 'Jelly-like material that holds organelles and supports many cell reactions.',
    analogy: 'Think of it as the cell workspace.',
    team: 'Surrounds and supports all organelles.'
  },
  nucleus: {
    name: 'Nucleus',
    color: '#D968E8',
    job: 'Stores DNA and sends instructions that control many cell activities.',
    analogy: 'Think of it as the principal office.',
    team: 'Its instructions guide ribosomes in making proteins.'
  },
  mitochondria: {
    name: 'Mitochondria',
    color: '#FF9A55',
    job: 'Release usable energy from food.',
    analogy: 'Think of them as power plants.',
    team: 'Their energy supports almost every cell job.'
  },
  ribosomes: {
    name: 'Ribosomes',
    color: '#FFD06A',
    job: 'Build proteins used for growth, repair, and many cell functions.',
    analogy: 'Think of them as tiny factories.',
    team: 'Use nucleus instructions and often work on rough ER.'
  },
  roughER: {
    name: 'Rough ER',
    color: '#68CEE8',
    job: 'Helps process and move proteins. Ribosomes make it look rough.',
    analogy: 'Think of it as a conveyor system.',
    team: 'Works with ribosomes and Golgi.'
  },
  smoothER: {
    name: 'Smooth ER',
    color: '#6BE0A8',
    job: 'Makes lipids and helps break down some harmful chemicals.',
    analogy: 'Think of it as a chemistry lab.',
    team: 'Supports membrane and cell chemistry.'
  },
  golgi: {
    name: 'Golgi Body',
    color: '#F263B1',
    job: 'Modifies, sorts, packages, and ships materials.',
    analogy: 'Think of it as a post office.',
    team: 'Receives from ER and sends materials in vesicles.'
  },
  vacuole: {
    name: 'Vacuole',
    color: '#A995F4',
    job: 'Stores water, nutrients, and waste materials.',
    analogy: 'Think of it as a storage room.',
    team: 'Helps organize materials inside the cell.'
  },
  lysosome: {
    name: 'Lysosome',
    color: '#FF7777',
    job: 'Breaks down waste and worn-out cell parts.',
    analogy: 'Think of it as a recycling center.',
    team: 'Works with vesicles to receive unwanted material.'
  },
  vesicles: {
    name: 'Vesicles',
    color: '#83DDF3',
    job: 'Small sacs that move materials around the cell.',
    analogy: 'Think of them as delivery trucks.',
    team: 'Connect ER, Golgi, membrane, and lysosomes.'
  }
};

class AnimalCellScreenView extends ScreenView {
  constructor( model ) {
    super();

    const title = new Text( 'Animal Cell Systems Lab', {
      font: new PhetFont( { size: 30, weight: 'bold' } ),
      fill: '#125F7B',
      centerX: this.layoutBounds.centerX,
      top: 12
    } );
    this.addChild( title );

    const subtitle = new Text( 'Learn → Explore → What Happens If? → Rescue', {
      font: new PhetFont( 16 ),
      fill: '#486C7A',
      centerX: this.layoutBounds.centerX,
      top: title.bottom + 4
    } );
    this.addChild( subtitle );

    const cellRoot = new Node();
    cellRoot.centerX = this.layoutBounds.centerX;
    cellRoot.centerY = this.layoutBounds.centerY + 30;
    this.addChild( cellRoot );

    const membrane = new Circle( 235, {
      fill: '#A6EAF7',
      stroke: '#54BFD7',
      lineWidth: 14,
      scaleY: 0.78
    } );
    cellRoot.addChild( membrane );

    const cytoplasm = new Circle( 210, {
      fill: '#E9FBFF',
      opacity: 0.78,
      scaleY: 0.78
    } );
    cellRoot.addChild( cytoplasm );

    const organelleNodes = {};
    const createOrganelle = ( key, x, y, radius ) => {
      const data = INFO[ key ];
      const circle = new Circle( radius, {
        fill: data.color,
        stroke: '#34505C',
        lineWidth: 2,
        cursor: 'pointer'
      } );
      const label = new Text( data.name, {
        font: new PhetFont( { size: Math.max( 11, radius / 3.6 ), weight: 'bold' } ),
        maxWidth: radius * 1.7,
        centerX: 0,
        centerY: 0,
        fill: '#153248'
      } );
      const node = new Node( {
        children: [ circle, label ],
        x: x,
        y: y,
        cursor: 'pointer'
      } );
      node.addInputListener( new FireListener( {
        fire: () => {
          model.selectedOrganelleProperty.value = key;
        }
      } ) );
      organelleNodes[ key ] = node;
      cellRoot.addChild( node );
    };

    createOrganelle( 'nucleus', -35, -35, 66 );
    createOrganelle( 'mitochondria', -145, -85, 45 );
    createOrganelle( 'roughER', -105, 90, 55 );
    createOrganelle( 'smoothER', 35, -135, 43 );
    createOrganelle( 'golgi', 125, -50, 50 );
    createOrganelle( 'ribosomes', -165, 45, 38 );
    createOrganelle( 'lysosome', 95, 100, 30 );
    createOrganelle( 'vacuole', 25, 135, 36 );
    createOrganelle( 'vesicles', 165, 70, 30 );

    const membraneHotspot = new Circle( 18, {
      fill: INFO.membrane.color,
      stroke: '#34505C',
      lineWidth: 2,
      cursor: 'pointer',
      left: membrane.left + 15,
      top: membrane.top + 30
    } );
    membraneHotspot.addInputListener( new FireListener( {
      fire: () => {
        model.selectedOrganelleProperty.value = 'membrane';
      }
    } ) );
    cellRoot.addChild( membraneHotspot );

    const cytoplasmHotspot = new Circle( 18, {
      fill: INFO.cytoplasm.color,
      stroke: '#34505C',
      lineWidth: 2,
      cursor: 'pointer',
      left: membrane.left + 45,
      top: membrane.top + 80
    } );
    cytoplasmHotspot.addInputListener( new FireListener( {
      fire: () => {
        model.selectedOrganelleProperty.value = 'cytoplasm';
      }
    } ) );
    cellRoot.addChild( cytoplasmHotspot );

    const infoPanel = new Rectangle( 0, 0, 280, 350, 16, 16, {
      fill: 'white',
      stroke: '#82C8DC',
      lineWidth: 2,
      right: this.layoutBounds.maxX - 15,
      top: 95
    } );
    this.addChild( infoPanel );

    const infoTitle = new Text( '', {
      font: new PhetFont( { size: 24, weight: 'bold' } ),
      fill: '#125F7B',
      left: infoPanel.left + 16,
      top: infoPanel.top + 16,
      maxWidth: 245
    } );
    const infoJob = new Text( '', {
      font: new PhetFont( 16 ),
      fill: '#183A4B',
      left: infoPanel.left + 16,
      top: infoPanel.top + 60,
      maxWidth: 245
    } );
    const infoAnalogy = new Text( '', {
      font: new PhetFont( 15 ),
      fill: '#5F4D21',
      left: infoPanel.left + 16,
      top: infoPanel.top + 155,
      maxWidth: 245
    } );
    const infoTeam = new Text( '', {
      font: new PhetFont( 15 ),
      fill: '#4B5573',
      left: infoPanel.left + 16,
      top: infoPanel.top + 225,
      maxWidth: 245
    } );
    this.addChild( infoTitle );
    this.addChild( infoJob );
    this.addChild( infoAnalogy );
    this.addChild( infoTeam );

    const speakButton = new RectangularPushButton( {
      content: new Text( '🔊 Speak', { font: new PhetFont( 16 ) } ),
      listener: () => {
        const key = model.selectedOrganelleProperty.value;
        const data = INFO[ key ];
        if ( window.speechSynthesis ) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(
            data.name + '. ' + data.job + ' ' + data.analogy + ' ' + data.team
          );
          utterance.rate = 0.93;
          utterance.pitch = 1.08;
          window.speechSynthesis.speak( utterance );
        }
      },
      baseColor: '#79E5B1',
      left: infoPanel.left + 16,
      bottom: infoPanel.bottom - 18
    } );
    this.addChild( speakButton );

    model.selectedOrganelleProperty.link( key => {
      const data = INFO[ key ];
      infoTitle.string = data.name;
      infoJob.string = data.job;
      infoAnalogy.string = 'Visual analogy: ' + data.analogy;
      infoTeam.string = 'Works with: ' + data.team;
    } );

    const modeButtons = [
      [ 'Learn', 'learn', '#61D1EA' ],
      [ 'Explore', 'explore', '#8DD7F1' ],
      [ 'What Happens If?', 'whatif', '#FFB5D9' ],
      [ 'Rescue Challenge', 'challenge', '#FFE080' ]
    ].map( item => new RectangularPushButton( {
      content: new Text( item[ 0 ], { font: new PhetFont( 15 ) } ),
      baseColor: item[ 2 ],
      listener: () => {
        model.modeProperty.value = item[ 1 ];
      }
    } ) );

    const modeBar = new HBox( {
      children: modeButtons,
      spacing: 8,
      centerX: this.layoutBounds.centerX,
      top: 62
    } );
    this.addChild( modeBar );

    const leftPanel = new Rectangle( 0, 0, 260, 470, 16, 16, {
      fill: 'white',
      stroke: '#82C8DC',
      lineWidth: 2,
      left: 15,
      top: 95
    } );
    this.addChild( leftPanel );

    const leftContentRoot = new Node();
    this.addChild( leftContentRoot );

    const meterText = new Text( '', {
      font: new PhetFont( 15 ),
      fill: '#173A4A',
      maxWidth: 225
    } );

    const updateLeftPanel = mode => {
      leftContentRoot.removeAllChildren();

      const panelTitle = new Text(
        mode === 'learn' ? 'Learn First' :
        mode === 'explore' ? 'Free Exploration' :
        mode === 'whatif' ? 'What Happens If?' : 'Cell Rescue Challenge',
        {
          font: new PhetFont( { size: 21, weight: 'bold' } ),
          fill: '#125F7B',
          left: leftPanel.left + 16,
          top: leftPanel.top + 16,
          maxWidth: 225
        }
      );
      leftContentRoot.addChild( panelTitle );

      if ( mode === 'learn' ) {
        const t = new Text(
          'Click organelles. Listen to the short explanation. Then compare how their jobs connect.',
          {
            font: new PhetFont( 15 ),
            fill: '#4A6570',
            maxWidth: 225,
            left: leftPanel.left + 16,
            top: panelTitle.bottom + 14
          }
        );
        leftContentRoot.addChild( t );
      }
      else if ( mode === 'explore' ) {
        const t = new Text(
          'Discovery prompts:\n\n• Find two organelles that work together.\n• Trace the protein pathway.\n• Find the energy source.\n• Find the clean-up system.',
          {
            font: new PhetFont( 15 ),
            fill: '#4A6570',
            maxWidth: 225,
            left: leftPanel.left + 16,
            top: panelTitle.bottom + 14
          }
        );
        leftContentRoot.addChild( t );
      }
      else if ( mode === 'whatif' ) {
        const experiments = [
          [ '⚡ More energy needed', 'energy' ],
          [ '🧬 Nucleus stops', 'nucleus' ],
          [ '🏭 Ribosomes stop', 'ribosomes' ],
          [ '📦 Golgi stops', 'golgi' ],
          [ '🧹 Lysosomes stop', 'lysosome' ],
          [ '🚪 Membrane too open', 'membrane' ]
        ];
        const buttons = experiments.map( item => new RectangularPushButton( {
          content: new Text( item[ 0 ], { font: new PhetFont( 14 ), maxWidth: 205 } ),
          baseColor: '#FFF3B0',
          listener: () => {
            model.runExperiment( item[ 1 ] );
          }
        } ) );
        const resetButton = new RectangularPushButton( {
          content: new Text( 'Reset Healthy Cell', { font: new PhetFont( 14 ) } ),
          baseColor: '#9FF0C4',
          listener: () => {
            model.resetCell();
          }
        } );
        const vbox = new VBox( {
          children: [ ...buttons, resetButton ],
          spacing: 7,
          left: leftPanel.left + 16,
          top: panelTitle.bottom + 12
        } );
        leftContentRoot.addChild( vbox );

        meterText.left = leftPanel.left + 16;
        meterText.top = vbox.bottom + 12;
        leftContentRoot.addChild( meterText );
      }
      else {
        const t = new Text(
          'A cell is failing. Use evidence from your What-If experiments to diagnose the problem.\n\nQuestion:\nWhy does shutting down the nucleus eventually reduce protein production?',
          {
            font: new PhetFont( 15 ),
            fill: '#4A6570',
            maxWidth: 225,
            left: leftPanel.left + 16,
            top: panelTitle.bottom + 14
          }
        );
        leftContentRoot.addChild( t );
      }
    };

    const updateMeters = () => {
      meterText.string =
        'Live evidence\n' +
        'Energy: ' + model.energyProperty.value + '%\n' +
        'Protein: ' + model.proteinProperty.value + '%\n' +
        'Waste control: ' + model.wasteControlProperty.value + '%\n' +
        'Cell balance: ' + model.balanceProperty.value + '%';
    };

    model.modeProperty.link( updateLeftPanel );
    model.energyProperty.link( updateMeters );
    model.proteinProperty.link( updateMeters );
    model.wasteControlProperty.link( updateMeters );
    model.balanceProperty.link( updateMeters );

    const setWorkingVisual = ( property, key ) => {
      property.link( working => {
        const nodes = Object.entries( organelleNodes ).filter( entry => entry[ 0 ] === key ).map( entry => entry[ 1 ] );
        nodes.forEach( node => {
          node.opacity = working ? 1 : 0.2;
        } );
      } );
    };

    setWorkingVisual( model.nucleusWorkingProperty, 'nucleus' );
    setWorkingVisual( model.ribosomesWorkingProperty, 'ribosomes' );
    setWorkingVisual( model.golgiWorkingProperty, 'golgi' );
    setWorkingVisual( model.lysosomeWorkingProperty, 'lysosome' );

    model.highEnergyDemandProperty.link( high => {
      organelleNodes.mitochondria.scale = high ? 1.18 : 1;
    } );

    model.membraneStableProperty.link( stable => {
      membrane.stroke = stable ? '#54BFD7' : '#FF4F5F';
      membrane.lineWidth = stable ? 14 : 22;
    } );

    const resetAllButton = new ResetAllButton( {
      listener: () => {
        model.reset();
      },
      right: this.layoutBounds.maxX - 18,
      bottom: this.layoutBounds.maxY - 18
    } );
    this.addChild( resetAllButton );
  }
}

export default AnimalCellScreenView;
