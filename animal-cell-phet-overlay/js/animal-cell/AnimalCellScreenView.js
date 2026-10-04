// Copyright 2015-2026, University of Colorado Boulder

/**
 * Interactive systems-lab view for the Animal Cell simulation.
 *
 * @author Suzan Ahmed Mustafa
 */

import Dimension2 from '../../../dot/js/Dimension2.js';
import Range from '../../../dot/js/Range.js';
import { roundSymmetric } from '../../../dot/js/util/roundSymmetric.js';
import NumberProperty from '../../../axon/js/NumberProperty.js';
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
import VSlider from '../../../sun/js/VSlider.js';
import RectangularPushButton from '../../../sun/js/buttons/RectangularPushButton.js';
import AnimalCellModel from './AnimalCellModel.js';

const INFO = {
  membrane: {
    name: 'Cell membrane', color: '#36B8D0',
    job: 'Controls what enters and leaves the cell.',
    mechanism: 'Selective channels regulate passage.',
    connects: 'Water, nutrients, wastes, and transport vesicles.',
    failure: 'Transport and internal balance become disrupted.',
    observation: 'Transport particles and cell volume respond to the membrane setting.',
    position: [ 185, 4 ], radius: 21, functionKey: 'permeability', testVariable: 'permeability', pathway: 'transport'
  },
  cytoplasm: {
    name: 'Cytoplasm', color: '#C9F4FF',
    job: 'Fluid interior where organelles are suspended.',
    mechanism: 'Many chemical reactions occur in this space.',
    connects: 'Organelles and materials moving between them.',
    failure: 'Cell processes lose their supportive environment.',
    observation: 'Watch whole-cell movement and color.',
    position: [ -10, 0 ], radius: 78, pathway: 'energy'
  },
  nucleus: {
    name: 'Nucleus', color: '#D968E8',
    job: 'Contains DNA and coordinates many cell activities.',
    mechanism: 'DNA instructions are copied into RNA messages for protein-making.',
    connects: 'Sends RNA instructions to ribosomes.',
    failure: 'Instruction-led protein production decreases.',
    position: [ -22, -12 ], radius: 48, functionKey: 'nucleusSignal', testVariable: 'nucleusSignal', pathway: 'protein'
  },
  nucleolus: {
    name: 'Nucleolus', color: '#9B40B6',
    job: 'Makes components used to assemble ribosomes.',
    connects: 'Supports ribosomes and protein production.',
    failure: 'Ribosome support and protein output decrease.',
    position: [ -5, -17 ], radius: 14, pathway: 'protein'
  },
  mitochondria: {
    name: 'Mitochondrion', color: '#FF9A55',
    job: 'Makes ATP, a usable energy source, during cellular respiration.',
    mechanism: 'Uses oxygen and glucose in respiration to supply ATP.',
    connects: 'Oxygen + glucose; ATP powers many cell processes.',
    failure: 'ATP decreases, so cell processes slow down.',
    importance: 'ATP supplies energy for transport and protein processing.',
    observation: 'ATP particles thin out and their movement slows.',
    position: [ -132, -70 ], radius: 33, functionKey: 'mitochondria', testVariable: 'mitochondria', pathway: 'energy'
  },
  ribosomes: {
    name: 'Ribosomes', color: '#FFD06A',
    job: 'Builds proteins from RNA instructions.',
    mechanism: 'Reads RNA and joins amino acids into a protein chain.',
    connects: 'Works with the nucleus and rough ER.',
    failure: 'Protein production decreases.',
    importance: 'Proteins form structures and carry out many cell jobs.',
    observation: 'Fewer protein particles enter the pathway.',
    position: [ -150, 28 ], radius: 24, functionKey: 'ribosomes', testVariable: 'ribosomes', pathway: 'protein'
  },
  roughER: {
    name: 'Rough ER', color: '#68CEE8',
    job: 'Processes and routes many newly made proteins.',
    mechanism: 'Folds and processes proteins before routing them onward.',
    connects: 'Ribosomes, transport vesicles, and Golgi.',
    failure: 'Fewer proteins reach Golgi for packaging.',
    importance: 'New proteins need processing before many can be shipped.',
    observation: 'Fewer protein particles pass from ER to Golgi.',
    position: [ -87, 89 ], radius: 31, functionKey: 'roughER', testVariable: 'roughER', pathway: 'protein'
  },
  smoothER: {
    name: 'Smooth ER', color: '#6BE0A8',
    job: 'Makes lipids and helps process some harmful substances.',
    connects: 'Cell membranes and chemical balance.',
    failure: 'Lipid and detox support may decrease; details are simplified here.',
    position: [ 11, -111 ], radius: 27, pathway: 'waste'
  },
  golgi: {
    name: 'Golgi apparatus', color: '#F263B1',
    job: 'Modifies, sorts, and packages materials for delivery.',
    mechanism: 'Sorts cargo and packs it into transport vesicles.',
    connects: 'Receives proteins from ER; sends them in vesicles.',
    failure: 'Proteins back up and export decreases.',
    importance: 'Sorting and packaging route proteins to their destinations.',
    observation: 'Protein cargo builds up before export.',
    position: [ 97, -63 ], radius: 32, functionKey: 'golgi', testVariable: 'golgi', pathway: 'protein'
  },
  lysosome: {
    name: 'Lysosome', color: '#FF7777',
    job: 'Breaks down and recycles waste and worn-out parts.',
    mechanism: 'Digestive enzymes break material into reusable components.',
    connects: 'Receives waste in transport vesicles.',
    failure: 'Waste builds up and cell stress rises.',
    importance: 'Recycling clears worn parts and material the cell no longer needs.',
    observation: 'Waste particles accumulate as recycling slows.',
    position: [ 86, 103 ], radius: 24, functionKey: 'lysosomes', testVariable: 'lysosomes', pathway: 'waste'
  },
  vesicles: {
    name: 'Vesicles', color: '#83DDF3',
    job: 'Membrane-bound sacs that carry materials.',
    connects: 'Link ER, Golgi, lysosomes, and membrane.',
    failure: 'Delivery between cell regions slows.',
    position: [ 149, 66 ], radius: 21, pathway: 'protein'
  },
  vacuole: {
    name: 'Small vacuole', color: '#A995F4',
    job: 'A small storage sac for water and other materials.',
    connects: 'Stores materials within the cytoplasm.',
    failure: 'Storage and relative cell volume may change.',
    position: [ 24, 125 ], radius: 23, pathway: 'transport'
  },
  cytoskeleton: {
    name: 'Cytoskeleton', color: '#4E8FA8',
    job: 'Protein filaments that support cell shape and movement.',
    connects: 'Positions organelles and guides transport.',
    failure: 'Structure and movement become less organized.',
    position: [ -13, 61 ], radius: 14, pathway: 'transport'
  },
  centrosome: {
    name: 'Centrosome / centrioles', color: '#F0B94E',
    job: 'Organizes microtubules, especially during cell division.',
    connects: 'Works with the cytoskeleton; it has no surrounding membrane.',
    failure: 'Cell-division organization may be affected; division is not simulated.',
    position: [ 50, 24 ], radius: 19, pathway: 'transport'
  }
};

const EXPLORE_VARIABLE_KEYS = [ 'ph', 'temperature', 'water', 'permeability', 'oxygen', 'glucose', 'mitochondria', 'ribosomes', 'golgi', 'lysosomes', 'energy' ];
const VARIABLE_PATHWAYS = {
  ph: 'energy', temperature: 'energy', water: 'transport', permeability: 'transport', energy: 'energy',
  oxygen: 'energy', glucose: 'energy', mitochondria: 'energy', ribosomes: 'protein',
  golgi: 'protein', lysosomes: 'waste'
};
const VARIABLE_ORGANELLES = {
  oxygen: 'mitochondria', glucose: 'mitochondria', mitochondria: 'mitochondria',
  ribosomes: 'ribosomes', golgi: 'golgi', lysosomes: 'lysosome',
  water: 'membrane', permeability: 'membrane', ph: 'cytoplasm', temperature: 'cytoplasm', energy: 'cytoplasm'
};
const EXPLORE_VARIABLES_BY_ORGANELLE = {
  mitochondria: [ 'mitochondria', 'oxygen', 'glucose' ],
  membrane: [ 'permeability', 'water' ],
  cytoplasm: [ 'ph', 'temperature', 'water', 'energy' ],
  ribosomes: [ 'ribosomes' ],
  golgi: [ 'golgi' ],
  lysosome: [ 'lysosomes' ]
};
const EXPLORE_PART_DETAILS = {
  cytoplasm: {
    job: 'Fluid interior that suspends organelles.',
    mechanism: 'Many cell reactions happen here.',
    connects: 'All organelles and moving materials.',
    failure: 'Cell processes lose their support.',
    observation: 'Watch whole-cell color and activity.'
  },
  membrane: {
    job: 'Controls what enters and leaves.',
    mechanism: 'Channels regulate selective transport.',
    connects: 'Water, nutrients, wastes, vesicles.',
    failure: 'Balance and transport are disrupted.',
    observation: 'Watch particles and cell volume.'
  },
  mitochondria: {
    job: 'Supplies usable energy as ATP.',
    mechanism: 'Uses oxygen and glucose in respiration.',
    connects: 'Oxygen + glucose → ATP for cell work.',
    failure: 'ATP, transport, and cell activity fall.',
    observation: 'Energy particles and motion slow.'
  },
  ribosomes: {
    job: 'Builds proteins from RNA instructions.',
    mechanism: 'Joins amino acids into protein chains.',
    connects: 'Nucleus, rough ER, and protein traffic.',
    failure: 'Protein production and traffic fall.',
    observation: 'Watch protein particles.'
  },
  golgi: {
    job: 'Sorts, modifies, and packages cell cargo.',
    mechanism: 'Packs materials into transport vesicles.',
    connects: 'Receives cargo from ER; sends vesicles.',
    failure: 'Cargo backs up; export decreases.',
    observation: 'Watch the Golgi backlog.'
  },
  lysosome: {
    job: 'Breaks down and recycles cell waste.',
    mechanism: 'Enzymes digest material for reuse.',
    connects: 'Waste cargo arriving in vesicles.',
    failure: 'Waste builds up; stress increases.',
    observation: 'Watch waste particles and stress.'
  }
};

const METRICS = [
  [ 'ATP availability', 'atp', '#E5A02C' ],
  [ 'Protein production', 'protein', '#4A91D3' ],
  [ 'Waste burden', 'waste', '#D66B5B' ],
  [ 'Cell volume (% baseline)', 'volume', '#8A74C7' ],
  [ 'Model health score', 'health', '#4DA66B' ],
  [ 'Oxygen saturation', 'oxygen', '#4EB5D3' ],
  [ 'Glucose concentration', 'glucose', '#D89B3E' ],
  [ 'Protein export', 'export', '#D15A9F' ],
  [ 'Membrane transport', 'transport', '#39AFC2' ],
  [ 'Internal balance', 'balance', '#39A887' ],
  [ 'Cell stress', 'stress', '#CE6744' ]
];

const metricProperty = ( model, key ) => model.variables[ key ] || model[ key + 'Property' ];
const readableFont = size => new PhetFont( Math.max( 18, size * 1.25 ) );
const readableBoldFont = size => new PhetFont( { size: Math.max( 20, size * 1.25 ), weight: 'bold' } );
const wrapAtCharacters = ( text, maxCharacters ) => {
  const lines = [];
  let line = '';
  text.split( /\s+/ ).forEach( word => {
    const nextLine = line ? line + ' ' + word : word;
    if ( line && nextLine.length > maxCharacters ) {
      lines.push( line );
      line = word;
    }
    else {
      line = nextLine;
    }
  } );
  if ( line ) {
    lines.push( line );
  }
  return lines.join( '\n' );
};
const definitionForKey = key => AnimalCellModel.VARIABLE_DEFINITIONS.find( definition => definition.key === key );
const formattedNumber = ( value, digits ) => {
  const scale = Math.pow( 10, digits );
  return String( roundSymmetric( value * scale ) / scale );
};
const inputDisplayValue = ( key, value ) => {
  const definition = definitionForKey( key );
  const digits = key === 'ph' || key === 'temperature' || key === 'glucose' ? 1 : 0;
  const amount = formattedNumber( value, digits );
  return definition && definition.unit ? amount + ( definition.unit.startsWith( '%' ) ? '' : ' ' ) + definition.unit : amount;
};
const healthyRangeFor = key => ( {
  oxygen: 'Healthy reference: 80–100% saturation', glucose: 'Healthy reference: 4–6 mM',
  water: 'Isotonic reference: 300 mOsm/L', ph: 'Healthy reference: pH 7.2–7.6',
  temperature: 'Healthy reference: 36–38 °C', permeability: 'Normal is 100%; very high disrupts selectivity.',
  energy: 'ATP availability · 100% is the healthy baseline',
  mitochondria: 'MODEL FUNCTION LEVEL · 100% = normal', ribosomes: 'MODEL FUNCTION LEVEL · 100% = normal',
  golgi: 'MODEL FUNCTION LEVEL · 100% = normal', lysosomes: 'MODEL FUNCTION LEVEL · 100% = normal',
  roughER: 'MODEL FUNCTION LEVEL · 100% = normal', nucleusSignal: 'MODEL FUNCTION LEVEL · 100% = normal',
  toxins: 'Model exposure scale · low values indicate less exposure', proteinDemand: 'Model setting · typical range 40–70%'
} )[ key ] || 'Healthy range: 80–100%';
const conciseVariableName = key => ( {
  oxygen: 'Oxygen level', glucose: 'Glucose level', water: 'Outside osmolarity', ph: 'pH', energy: 'ATP availability',
  temperature: 'Temperature', permeability: 'Membrane', mitochondria: 'Mitochondria',
  ribosomes: 'Ribosomes', roughER: 'Rough ER', golgi: 'Golgi', lysosomes: 'Lysosome',
  nucleusSignal: 'Nucleus signals', toxins: 'Toxins', proteinDemand: 'Protein demand'
} )[ key ] || key;
const mixColor = ( first, second, amount ) => {
  const parse = color => [ 1, 3, 5 ].map( index => parseInt( color.slice( index, index + 2 ), 16 ) );
  const a = parse( first );
  const b = parse( second );
  const channels = a.map( ( value, index ) => roundSymmetric( value + ( b[ index ] - value ) * amount ) );
  return '#' + channels.map( channel => channel.toString( 16 ).padStart( 2, '0' ) ).join( '' );
};

class AnimalCellScreenView extends ScreenView {
  constructor( model ) {
    super();

    const viewWidth = this.layoutBounds.width;
    const leftX = 12;
    const panelTop = 102;
    const panelHeight = Math.min( 600, this.layoutBounds.height - 154 );
    const sideWidth = 320;
    const rightX = this.layoutBounds.maxX - sideWidth - 12;

    const title = new Text( 'Animal Cell Interactive Systems Lab', {
      font: new PhetFont( { size: 32, weight: 'bold' } ),
      fill: '#125F7B', centerX: this.layoutBounds.centerX, top: 8,
      maxWidth: viewWidth - 24
    } );
    this.addChild( title );
    this.addChild( new Text( 'Select a cell part. See its role, follow its pathway, and test what changes.', {
      font: readableFont( 14 ), fill: '#486C7A', centerX: this.layoutBounds.centerX,
      top: title.bottom + 2, maxWidth: viewWidth - 30
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
    const selectOrganelle = key => {
      model.restoreHealthyCellGradually();
      model.selectedOrganelleProperty.value = key;
      const relatedVariable = VARIABLE_ORGANELLES[ key ];
      if ( relatedVariable && EXPLORE_VARIABLE_KEYS.includes( relatedVariable ) ) {
        model.selectedVariableProperty.value = relatedVariable;
      }
      model.pathwayHighlightProperty.value = INFO[ key ].pathway || null;
      model.rightPanelProperty.value = 'data';
      model.trialLockedProperty.value = false;
      activeExploreFlowStep = 1;
      variableMenuOpen = false;
      model.startTrial();
      renderLeft();
      renderRight();
    };
    const membrane = new Circle( 194, {
      fill: '#A6EAF7', stroke: '#54BFD7', lineWidth: 10, scaleY: 0.82, cursor: 'pointer'
    } );
    const cytoplasm = new Circle( 174, {
      fill: '#E9FBFF', opacity: 0.92, scaleY: 0.82, cursor: 'pointer'
    } );
    const cytoplasmGlow = new Circle( 166, {
      fill: '#84DDF4', opacity: 0, scaleY: 0.82, pickable: false
    } );
    const cytoplasmLabel = new Text( 'Cytoplasm', {
      font: new PhetFont( { size: 16, weight: 'bold' } ), fill: '#153248', centerX: 0, centerY: -166,
      visible: false, pickable: false
    } );
    const membraneLabel = new Text( 'Cell membrane', {
      font: new PhetFont( { size: 16, weight: 'bold' } ), fill: '#153248', centerX: 0, centerY: -188,
      visible: false, pickable: false
    } );
    membrane.addInputListener( new FireListener( { fire: () => {
      selectOrganelle( 'membrane' );
      if ( model.projectActiveProperty.value ) {
        model.completeProjectMilestone( 1 );
      }
    } } ) );
    cytoplasm.addInputListener( new FireListener( { fire: () => {
      selectOrganelle( 'cytoplasm' );
      if ( model.projectActiveProperty.value ) {
        model.completeProjectMilestone( 1 );
      }
    } } ) );
    cellRoot.addChild( membrane );
    cellRoot.addChild( cytoplasm );
    cellRoot.addChild( cytoplasmGlow );
    cellRoot.addChild( cytoplasmLabel );
    cellRoot.addChild( membraneLabel );
    const membraneWrinkles = [];
    for ( let index = 0; index < 10; index++ ) {
      const angle = index * Math.PI * 2 / 10;
      const radius = 183;
      const tangent = angle + Math.PI / 2;
      const wrinkleShape = new Shape();
      wrinkleShape.moveToPoint( new Vector2( Math.cos( angle ) * radius, Math.sin( angle ) * radius ) );
      wrinkleShape.lineToPoint( new Vector2( Math.cos( angle ) * ( radius + 4 ) + Math.cos( tangent ) * 4,
        Math.sin( angle ) * ( radius + 4 ) + Math.sin( tangent ) * 4 ) );
      wrinkleShape.lineToPoint( new Vector2( Math.cos( angle ) * ( radius - 2 ) - Math.cos( tangent ) * 3,
        Math.sin( angle ) * ( radius - 2 ) - Math.sin( tangent ) * 3 ) );
      const wrinkle = new Path( wrinkleShape, {
        stroke: '#C95B53', lineWidth: 3, fill: null, opacity: 0, pickable: false
      } );
      membrane.addChild( wrinkle );
      membraneWrinkles.push( wrinkle );
    }
    const pathwayOverlays = {};
    const addPathwayOverlay = ( key, points, color ) => {
      const pathShape = new Shape();
      points.forEach( ( point, index ) => {
        const vector = new Vector2( point[ 0 ], point[ 1 ] );
        if ( index === 0 ) {
          pathShape.moveToPoint( vector );
        }
        else {
          pathShape.lineToPoint( vector );
        }
      } );
      const overlay = new Path( pathShape, {
        stroke: color, lineWidth: 8, opacity: 0, fill: null, pickable: false
      } );
      pathwayOverlays[ key ] = overlay;
      cellRoot.addChild( overlay );
    };
    addPathwayOverlay( 'energy', [ [ -132, -70 ], [ -150, 28 ], [ -87, 89 ], [ 149, 66 ] ], '#EAA22D' );
    addPathwayOverlay( 'protein', [ [ -22, -12 ], [ -150, 28 ], [ -87, 89 ], [ 97, -63 ], [ 149, 66 ], [ 185, 4 ] ], '#D84593' );
    addPathwayOverlay( 'waste', [ [ 138, 75 ], [ 86, 103 ] ], '#9B6E5F' );
    addPathwayOverlay( 'transport', [ [ -165, 65 ], [ -100, 125 ], [ 0, 153 ], [ 102, 125 ], [ 165, 65 ] ], '#2E9DB6' );

    const organelleNodes = {};
    const organelleShapes = {};
    const organelleLabels = {};
    const organelleActivity = {};
    let mitochondriaGlowNode = null;
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
        mitochondriaGlowNode = new Circle( 9, {
          fill: '#FFF28A', stroke: '#B87616', lineWidth: 1, centerX: 0, centerY: 0
        } );
        addPart( mitochondriaGlowNode );
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
      const labelText = key === 'centrosome' ? 'Centrosome' : key === 'cytoskeleton' ? 'Filaments' : key === 'golgi' ? 'Golgi' : key === 'mitochondria' ? 'Mito.' : data.name;
      const label = new Text( labelText, {
        font: new PhetFont( { size: 16, weight: 'bold' } ),
        fill: '#153248', maxWidth: key === 'centrosome' || key === 'nucleolus' ? 88 : Math.max( 60, data.radius * 2.8 ),
        centerX: 0, centerY: key === 'nucleus' ? -23 : key === 'nucleolus' ? 26 : 0, pickable: false
      } );
      const node = new Node( { children: [ ...parts, label ], x: x, y: y, cursor: 'pointer' } );
      node.addInputListener( new FireListener( { fire: () => {
        selectOrganelle( key );
        if ( model.projectActiveProperty.value ) {
          model.completeProjectMilestone( 1 );
        }
      } } ) );
      organelleNodes[ key ] = node;
      organelleShapes[ key ] = parts.filter( part => part.stroke !== null );
      organelleLabels[ key ] = label;
      cellRoot.addChild( node );
    };
    Object.keys( INFO ).filter( key => key !== 'membrane' && key !== 'cytoplasm' ).forEach( createOrganelle );

    // Moving particles follow the simplified protein, energy, and waste pathways.
    const proteinParticles = [ 0, 1, 2, 3, 4, 5 ].map( () => {
      const particle = new Circle( 5, { fill: '#E14D9B', stroke: '#8A2257', lineWidth: 1 } );
      cellRoot.addChild( particle );
      return particle;
    } );
    const energyParticles = [ 0, 1, 2, 3, 4, 5, 6, 7 ].map( () => {
      const particle = new Circle( 4, { fill: '#F3A719', stroke: '#A66A00', lineWidth: 1 } );
      cellRoot.addChild( particle );
      return particle;
    } );
    const wasteParticles = [ 0, 1, 2 ].map( () => {
      const particle = new Circle( 5, { fill: '#8B6C61', stroke: '#5D443C', lineWidth: 1 } );
      cellRoot.addChild( particle );
      return particle;
    } );
    const wasteBuildup = [ 0, 1, 2, 3, 4, 5 ].map( index => {
      const particle = new Circle( 4, {
        fill: '#9D7667', stroke: '#60483E', lineWidth: 1,
        centerX: 56 + index % 3 * 16, centerY: 77 + Math.floor( index / 3 ) * 18,
        visible: true
      } );
      cellRoot.addChild( particle );
      return particle;
    } );
    const golgiBacklogParticles = [ 0, 1, 2, 3, 4 ].map( index => {
      const particle = new Circle( 4, {
        fill: '#E14D9B', stroke: '#8A2257', lineWidth: 1,
        centerX: 66 + index % 3 * 10, centerY: -77 + Math.floor( index / 3 ) * 10,
        visible: true
      } );
      cellRoot.addChild( particle );
      return particle;
    } );
    const membraneParticles = [ 0, 1, 2, 3, 4, 5 ].map( () => {
      const particle = new Circle( 3, { fill: '#269FE8', stroke: '#176A81', lineWidth: 1 } );
      cellRoot.addChild( particle );
      return particle;
    } );
    const waterParticles = [ 0, 1, 2, 3, 4, 5, 6, 7 ].map( () => {
      const particle = new Circle( 5, { fill: '#1D9FE8', stroke: '#126C9F', lineWidth: 1 } );
      cellRoot.addChild( particle );
      return particle;
    } );
    const updateParticleVisibility = () => {
      const pathway = model.pathwayHighlightProperty.value;
      energyParticles.forEach( particle => { particle.visible = pathway === 'energy'; } );
      proteinParticles.forEach( particle => { particle.visible = pathway === 'protein'; } );
      wasteParticles.forEach( particle => { particle.visible = pathway === 'waste'; } );
      membraneParticles.forEach( particle => { particle.visible = pathway === 'transport' && model.selectedVariableProperty.value !== 'water'; } );
      waterParticles.forEach( particle => { particle.visible = pathway === 'transport' && model.selectedVariableProperty.value === 'water'; } );
      golgiBacklogParticles.forEach( particle => { particle.visible = pathway === 'protein'; } );
      wasteBuildup.forEach( particle => { particle.visible = pathway === 'waste' && model.wasteProperty.value > 22; } );
    };
    model.pathwayHighlightProperty.link( updateParticleVisibility );
    model.trialLockedProperty.link( updateParticleVisibility );
    model.selectedVariableProperty.link( updateParticleVisibility );
    updateParticleVisibility();
    const baseCellScale = Math.min( 1.02, ( panelHeight - 100 ) / 388, ( viewWidth - sideWidth * 2 - 60 ) / 388 );
    cellRoot.scale = baseCellScale;
    cellRoot.centerX = this.layoutBounds.centerX;
    cellRoot.centerY = panelTop + panelHeight * 0.47;

    const leftContent = new Node();
    const rightContent = new Node();
    const rightViewport = new Node( {
      clipArea: new Shape().rect( rightX + 2, panelTop + 2, sideWidth - 4, panelHeight - 4 )
    } );
    rightViewport.addChild( rightContent );
    const rightScrollControls = new Node();
    this.addChild( leftContent );
    this.addChild( rightViewport );
    this.addChild( rightScrollControls );
    const rightScrollProperty = new NumberProperty( 0 );
    rightScrollProperty.link( value => { rightContent.y = -value; } );
    let rightScrollSlider = null;
    let rightStatusText = null;
    let rightStatusBackground = null;
    let resultExplanationText = null;
    let activeExploreQuestion = null;
    let trialPanelPage = 'design';
    let variableMenuOpen = false;
    let activeExploreFlowStep = 1;
    let exploreStep = 1;
    let exploreStepLabel = null;
    let whatifStep = 2;
    let advancedTrialSaved = false;
    let projectPanelPage = 0;
    let projectCERFieldIndex = 0;
    const startFreshExploreTrial = () => {
      if ( model.projectActiveProperty.value ) {
        model.startProjectExperiment();
      }
      else {
        model.resetToHealthyCell();
        model.startTrial();
      }
    };
    const runCurrentTrial = () => {
      const startingSettings = model.trialStartSettingsProperty.value || {};
      const changedInputs = Object.keys( startingSettings ).filter( key => model.variables[ key ].value !== startingSettings[ key ] );
      if ( changedInputs.length !== 1 && !model.advancedExploreProperty.value ) {
        model.feedbackProperty.value = changedInputs.length > 1 ?
                                       'For a fair test, change only one input from its starting value. Restore the others, then run again.' :
                                       'Change the selected input from its healthy baseline before running the experiment.';
        return;
      }
      if ( !model.advancedExploreProperty.value && !model.predictionProperty.value ) {
        model.feedbackProperty.value = 'Choose a prediction before running the experiment.';
        return;
      }
      const definition = AnimalCellModel.VARIABLE_DEFINITIONS.find( item => item.key === model.selectedVariableProperty.value ) || AnimalCellModel.VARIABLE_DEFINITIONS[ 0 ];
      model.applyCurrentInputs();
      model.triggerFocusEffect( definition.key );
      model.pathwayHighlightProperty.value = definition.key === 'oxygen' || definition.key === 'glucose' || definition.key === 'mitochondria' ? 'energy' :
                                             definition.key === 'lysosomes' ? 'waste' :
                                             definition.key === 'water' || definition.key === 'permeability' ? 'transport' : 'protein';
      model.trialLockedProperty.value = true;
      exploreStep = 5;
      if ( model.projectActiveProperty.value ) {
        model.completeProjectMilestone( 2 );
      }
    };

    const makeButton = ( label, listener, color = '#DDF3FA', size = 16, maxWidth = sideWidth - 26 ) => new RectangularPushButton( {
      content: new Text( label, { font: readableFont( size ), maxWidth: maxWidth } ),
      baseColor: color, listener: listener
    } );
    const addPanelTitle = ( root, text, x, y ) => root.addChild( new Text( text, {
      font: new PhetFont( { size: 24, weight: 'bold' } ), fill: '#125F7B',
      left: x + 24, top: y + 20, maxWidth: sideWidth - 48
    } ) );
    const getResultExplanation = variableKey => {
      const inputs = model.appliedInputsProperty.value;
      return variableKey === 'ph' ? 'ATP and transport changed as pH moved away from its healthy zone.' :
             variableKey === 'water' ? 'Water moved ' + model.waterMovementProperty.value.toLowerCase() + '; cell volume responded.' :
             variableKey === 'permeability' ? inputs.permeability > 130 ? 'Selectivity and balance fell as uncontrolled passage rose.' : 'Nutrient entry and waste removal slowed.' :
             variableKey === 'energy' ? 'ATP fell first; transport and protein traffic slowed after it.' :
             variableKey === 'mitochondria' || variableKey === 'oxygen' || variableKey === 'glucose' ? 'Energy supply changed; ATP and active cell work responded.' :
             variableKey === 'ribosomes' ? 'Less protein was built, so downstream protein traffic fell.' :
             variableKey === 'golgi' ? 'Cargo accumulated as packaging and export slowed.' :
             variableKey === 'lysosomes' ? 'Waste accumulated and cell stress increased.' : 'The connected cell indicators changed together.';
    };
    const updateCellStateLabels = () => {
      const phenotype = model.phenotypeProperty.value;
      const colors = {
        HEALTHY: '#26734D', STRESSED: '#A45A17', SWOLLEN: '#16728B', SHRUNKEN: '#62458F',
        'LOW-VITALITY': '#5D6970', CRITICAL: '#B12E35'
      };
      if ( rightStatusText ) {
        rightStatusText.string = phenotype.replace( '-', ' ' );
        rightStatusText.fill = colors[ phenotype ] || '#294957';
        const stateBackgrounds = {
          HEALTHY: '#E0F3E8', STRESSED: '#FFF0D9', SWOLLEN: '#DDF3FA', SHRUNKEN: '#EAE3F6',
          'LOW-VITALITY': '#E5E8EA', CRITICAL: '#F9DEDC'
        };
        rightStatusBackground.fill = stateBackgrounds[ phenotype ];
      }
      if ( resultExplanationText && activeExploreFlowStep === 6 ) {
        resultExplanationText.string = getResultExplanation( model.selectedVariableProperty.value );
      }
    };
    model.phenotypeProperty.link( updateCellStateLabels );
    model.trialLockedProperty.link( updateCellStateLabels );
    model.selectedVariableProperty.link( updateCellStateLabels );
    model.appliedInputsProperty.link( updateCellStateLabels );
    model.atpProperty.link( () => updateCellStateLabels() );
    model.volumeProperty.link( () => updateCellStateLabels() );
    const getExperimentVariableKeys = () => EXPLORE_VARIABLES_BY_ORGANELLE[ model.selectedOrganelleProperty.value ] ||
      [ 'ph', 'temperature', 'water' ];
    const selectVariable = key => {
      model.restoreHealthyCellGradually();
      model.selectedVariableProperty.value = key;
      model.selectedOrganelleProperty.value = VARIABLE_ORGANELLES[ key ];
      model.pathwayHighlightProperty.value = VARIABLE_PATHWAYS[ key ];
      model.predictionProperty.value = null;
      activeExploreFlowStep = 2;
      model.startTrial();
      variableMenuOpen = false;
      renderRight();
    };

    const renderLeft = () => {
      leftContent.removeAllChildren();
      const mode = model.modeProperty.value;
      if ( mode === 'explore' ) {
        const data = INFO[ model.selectedOrganelleProperty.value ] || INFO.nucleus;
        const details = EXPLORE_PART_DETAILS[ model.selectedOrganelleProperty.value ] || data;
        addPanelTitle( leftContent, 'CELL PARTS', leftX, panelTop );
        let y = panelTop + 68;
        leftContent.addChild( new Text( data.name.toUpperCase(), {
          font: new PhetFont( { size: 24, weight: 'bold' } ), fill: '#163D50', left: leftX + 24, top: y,
          maxWidth: sideWidth - 48
        } ) );
        y += 40;
        const addSection = ( label, body, color = '#294957' ) => {
          leftContent.addChild( new Text( label, {
          font: readableBoldFont( 18 ), fill: '#125F7B', left: leftX + 24, top: y,
            maxWidth: sideWidth - 48
          } ) );
          y += 25;
          const text = new Text( wrapAtCharacters( body, 24 ), {
          font: readableFont( 18 ), fill: color, left: leftX + 24, top: y,
            maxWidth: sideWidth - 48
          } );
          leftContent.addChild( text );
          y = text.bottom + 16;
        };
        addSection( 'WHAT IT DOES', details.job );
        addSection( 'HOW IT WORKS', details.mechanism || 'Supports connected cell processes.' );
        addSection( 'WORKS WITH', details.connects );
        addSection( 'IF IT WEAKENS', details.failure, '#8B4338' );
        addSection( 'WHAT TO WATCH', details.observation || 'Watch its highlighted pathway.' );
        return;
      }
      const titleText = mode === 'project' ? 'Cell Survival Challenge' : mode === 'whatif' ? 'Experiment lab' : mode === 'challenge' ? 'Rescue the Cell' : mode === 'explore' ? 'Explore & test' : 'Cell Parts';
      addPanelTitle( leftContent, titleText, leftX, panelTop );
      if ( mode === 'project' ) {
        const projectCase = model.projectCaseProperty.value;
        const milestones = model.projectMilestonesProperty.value;
        const openProjectNotebook = () => {
          model.projectPageProperty.value = 'notebook';
          model.rightPanelProperty.value = 'project';
          renderLeft();
          renderRight();
        };
        const projectPageLabel = model.projectPageProperty.value === 'launch' ? 'PHASE 1 · LAUNCH THE PROBLEM' :
                                 model.projectPageProperty.value === 'investigate' ? 'PHASES 2–5 · INVESTIGATE & ANALYZE' :
                                 model.projectPageProperty.value === 'rescue' ? 'PHASES 6–7 · RESCUE & TEST' :
                                 model.projectPageProperty.value === 'product' ? 'PHASES 8–9 · PRODUCT & DEFENSE' : 'PROJECT NOTEBOOK';
        const pageHeading = new Text( projectPageLabel, {
          font: readableBoldFont( 9 ), fill: '#125F7B', left: leftX + 14, top: panelTop + 46,
          maxWidth: sideWidth - 28
        } );
        leftContent.addChild( pageHeading );

        if ( model.projectPageProperty.value === 'launch' ) {
          const caseIndex = AnimalCellModel.PROJECT_CASES.findIndex( item => item.id === projectCase.id );
          const caseButton = makeButton( 'MYSTERY CASE  ·  ' + projectCase.title + '  ▸', () => {
            const nextCase = AnimalCellModel.PROJECT_CASES[ ( caseIndex + 1 ) % AnimalCellModel.PROJECT_CASES.length ];
            model.startProjectCase( nextCase.id );
            model.rightPanelProperty.value = 'project';
            renderLeft();
            renderRight();
          }, '#EAF5F8', 9 );
          caseButton.left = leftX + 14;
          caseButton.top = pageHeading.bottom + 8;
          leftContent.addChild( caseButton );
          const drivingQuestion = new Text( 'DRIVING QUESTION\nHow can we keep an animal cell functioning when one part of its system fails?', {
            font: readableBoldFont( 9 ), fill: '#294957', left: leftX + 14,
            top: caseButton.bottom + 7, maxWidth: sideWidth - 28
          } );
          leftContent.addChild( drivingQuestion );
          const symptoms = new Text( 'CELL RESPONSE TEAM · CASE SYMPTOMS\n' + projectCase.symptoms, {
            font: readableFont( 8 ), fill: '#7A4827', left: leftX + 14,
            top: drivingQuestion.bottom + 7, maxWidth: sideWidth - 28
          } );
          leftContent.addChild( symptoms );
          const knowButton = makeButton( 'WHAT WE KNOW  ·  ' + model.projectKnowProperty.value, () => {
            model.cycleProjectNote( 'know' );
            renderLeft();
          }, '#EAF5F8', 8 );
          knowButton.left = leftX + 14;
          knowButton.top = symptoms.bottom + 7;
          leftContent.addChild( knowButton );
          const needButton = makeButton( 'WHAT WE NEED TO KNOW  ·  ' + model.projectNeedProperty.value, () => {
            model.cycleProjectNote( 'need' );
            renderLeft();
          }, '#EAF5F8', 8 );
          needButton.left = leftX + 14;
          needButton.top = knowButton.bottom + 5;
          leftContent.addChild( needButton );
          const startButton = makeButton( 'BEGIN THE INVESTIGATION', () => {
            model.projectPageProperty.value = 'investigate';
            model.completeProjectMilestone( 0 );
            renderLeft();
          }, '#BCEACB', 9 );
          startButton.left = leftX + 14;
          startButton.bottom = panelTop + panelHeight - 8;
          leftContent.addChild( startButton );
        }
        else if ( model.projectPageProperty.value === 'investigate' ) {
          const milestoneIndex = milestones.findIndex( completed => !completed );
          const milestoneNames = [ 'Understand the problem', 'Ask testable questions', 'Run first experiment', 'Collect required trials', 'Compare evidence', 'Propose diagnosis', 'Test rescue plan', 'Create final product', 'Present and defend' ];
          const progress = new Text( 'PROJECT MILESTONE  ·  ' + ( milestoneIndex < 0 ? 'ALL COMPLETE' : ( milestoneIndex + 1 ) + ' OF 9 · ' + milestoneNames[ milestoneIndex ] ) +
                                     '\nCompleted: ' + milestones.filter( Boolean ).length + ' / 9', {
            font: readableBoldFont( 9 ), fill: '#294957', left: leftX + 14, top: pageHeading.bottom + 10,
            maxWidth: sideWidth - 28
          } );
          leftContent.addChild( progress );
          const roleRotation = model.projectRoleRotationProperty.value;
          const roleLines = AnimalCellModel.PROJECT_ROLES.map( ( role, index ) => role + '  ·  Member ' + ( ( index + roleRotation ) % AnimalCellModel.PROJECT_ROLES.length + 1 ) ).join( '\n' );
          const roles = new Text( 'CELL RESPONSE TEAM  ·  ROTATE ROLES\n' + roleLines, {
            font: readableFont( 8 ), fill: '#294957', left: leftX + 14, top: progress.bottom + 9,
            maxWidth: sideWidth - 28
          } );
          leftContent.addChild( roles );
          const rotateRoles = makeButton( 'ROTATE TEAM ROLES', () => {
            model.projectRoleRotationProperty.value = ( roleRotation + 1 ) % AnimalCellModel.PROJECT_ROLES.length;
            renderLeft();
          }, '#EAF5F8', 8 );
          rotateRoles.left = leftX + 14;
          rotateRoles.top = roles.bottom + 5;
          leftContent.addChild( rotateRoles );
          const partsButton = makeButton( 'INSPECT CELL PARTS', () => {
            model.modeProperty.value = 'learn';
            model.completeProjectMilestone( 0 );
            model.rightPanelProperty.value = 'organelle';
            renderLeft();
            renderRight();
          }, '#DDF3FA', 9 );
          partsButton.left = leftX + 14;
          partsButton.top = rotateRoles.bottom + 7;
          leftContent.addChild( partsButton );
          const exploreButton = makeButton( 'OPEN EXPERIMENT LAB', () => {
            model.modeProperty.value = 'explore';
            model.experimentPanelProperty.value = 'controls';
            model.startProjectExperiment();
            exploreStep = 1;
            model.rightPanelProperty.value = 'data';
            renderLeft();
            renderRight();
          }, '#DDF3FA', 9 );
          exploreButton.left = leftX + 14;
          exploreButton.top = partsButton.bottom + 5;
          leftContent.addChild( exploreButton );
          const notebookButton = makeButton( 'OPEN PROJECT NOTEBOOK', openProjectNotebook, '#FFE8A3', 9 );
          notebookButton.left = leftX + 14;
          notebookButton.top = exploreButton.bottom + 5;
          leftContent.addChild( notebookButton );
          const trialStatus = new Text( 'Trials saved: ' + model.trialsProperty.value.length + ' / ' + model.requiredTrialsProperty.value +
                                       '\nSelect Project on the right to review evidence and teacher settings.', {
            font: readableFont( 8 ), fill: '#315C48', left: leftX + 14,
            top: notebookButton.bottom + 6, maxWidth: sideWidth - 28
          } );
          leftContent.addChild( trialStatus );
          const rescueButton = makeButton( milestones[ 5 ] ? 'TEST THE RESCUE PLAN' : 'RESCUE UNLOCKS AFTER EVIDENCE', () => {
            if ( milestones[ 5 ] ) {
              model.projectPageProperty.value = 'rescue';
              model.modeProperty.value = 'challenge';
              model.startRescueChallenge();
              model.rightPanelProperty.value = 'data';
              renderLeft();
            }
          }, '#FFE080', 8 );
          rescueButton.left = leftX + 14;
          rescueButton.bottom = panelTop + panelHeight - 8;
          rescueButton.enabled = milestones[ 5 ];
          leftContent.addChild( rescueButton );
        }
        else if ( model.projectPageProperty.value === 'notebook' ) {
        const notebookPages = [ 'Know / Need / Hypothesis', 'Trials / Patterns', 'Diagnosis / Rescue plan', 'CER / Reflection' ];
          const pageIndex = model.projectNotebookPageProperty.value;
          const pageButton = makeButton( 'NOTEBOOK PAGE  ·  ' + notebookPages[ pageIndex ] + '  ▸', () => {
            model.projectNotebookPageProperty.value = ( pageIndex + 1 ) % notebookPages.length;
            renderLeft();
          }, '#EAF5F8', 8 );
          pageButton.left = leftX + 14;
          pageButton.top = pageHeading.bottom + 8;
          leftContent.addChild( pageButton );
          const addNotebookEntry = ( label, property, key, y ) => {
            const entry = makeButton( label + '  ·  ' + property.value, () => {
              model.cycleProjectNote( key );
              renderLeft();
            }, '#F3F8FA', 8 );
            entry.left = leftX + 14;
            entry.top = y;
            leftContent.addChild( entry );
            return entry;
          };
          let entryBottom = pageButton.bottom;
          if ( pageIndex === 0 ) {
            entryBottom = addNotebookEntry( 'WHAT WE KNOW', model.projectKnowProperty, 'know', entryBottom + 8 ).bottom;
            entryBottom = addNotebookEntry( 'WHAT WE NEED TO KNOW', model.projectNeedProperty, 'need', entryBottom + 6 ).bottom;
            entryBottom = addNotebookEntry( 'HYPOTHESIS', model.projectHypothesisProperty, 'hypothesis', entryBottom + 6 ).bottom;
          }
          else if ( pageIndex === 1 ) {
            const trialCount = new Text( 'EXPERIMENTS  ·  ' + model.trialsProperty.value.length + ' / ' + model.requiredTrialsProperty.value + ' trials saved\nIndependent variable, before → after output, health, and observations are in Trials.', {
              font: readableFont( 8 ), fill: '#294957', left: leftX + 14, top: entryBottom + 8,
              maxWidth: sideWidth - 28
            } );
            leftContent.addChild( trialCount );
            entryBottom = addNotebookEntry( 'PATTERNS I NOTICE', model.projectPatternsProperty, 'patterns', trialCount.bottom + 8 ).bottom;
            const trialsButton = makeButton( 'REVIEW SAVED TRIALS', () => {
              model.rightPanelProperty.value = 'notebook';
              renderRight();
            }, '#DDF3FA', 8 );
            trialsButton.left = leftX + 14;
            trialsButton.top = entryBottom + 8;
            leftContent.addChild( trialsButton );
          }
          else if ( pageIndex === 2 ) {
            const evidenceGate = new Text( model.trialsProperty.value.length >= model.requiredTrialsProperty.value ?
                                           'Evidence requirement met. Compare two trials before finalizing a diagnosis.' :
                                           'Save at least ' + model.requiredTrialsProperty.value + ' trials before choosing a diagnosis.', {
              font: readableBoldFont( 8 ), fill: '#7A4827', left: leftX + 14, top: entryBottom + 8,
              maxWidth: sideWidth - 28
            } );
            leftContent.addChild( evidenceGate );
            const diagnosis = makeButton( 'CURRENT DIAGNOSIS  ·  ' + model.projectDiagnosisProperty.value, () => {
              if ( model.trialsProperty.value.length >= model.requiredTrialsProperty.value && milestones[ 4 ] ) {
                model.cycleProjectNote( 'diagnosis' );
              }
              else {
                model.feedbackProperty.value = 'Save the required trials and compare at least two before naming a likely failing system.';
              }
              renderLeft();
            }, '#F3F8FA', 8 );
            diagnosis.left = leftX + 14;
            diagnosis.top = evidenceGate.bottom + 7;
            diagnosis.enabled = model.trialsProperty.value.length >= model.requiredTrialsProperty.value && milestones[ 4 ];
            leftContent.addChild( diagnosis );
            entryBottom = addNotebookEntry( 'RESCUE PLAN', model.projectRescuePlanProperty, 'rescuePlan', diagnosis.bottom + 7 ).bottom;
          }
          else {
            const fields = [
              [ 'CLAIM', model.cerClaimProperty.value, () => model.cycleCER( 'claim' ) ],
              [ 'EVIDENCE', model.cerEvidenceProperty.value, () => model.cycleCER( 'evidence' ) ],
              [ 'REASONING', model.cerReasoningProperty.value, () => model.cycleCER( 'reasoning' ) ],
              [ 'CONCLUSION', model.projectConclusionProperty.value, () => model.cycleProjectNote( 'conclusion' ) ],
              [ 'REFLECTION', model.projectReflectionProperty.value, () => model.cycleProjectNote( 'reflection' ) ]
            ];
            const field = fields[ projectCERFieldIndex ];
            const fieldButton = makeButton( 'NOTEBOOK FIELD  ·  ' + field[ 0 ] + '  ▸', () => {
              projectCERFieldIndex = ( projectCERFieldIndex + 1 ) % fields.length;
              renderLeft();
            }, '#DDF3FA', 9 );
            fieldButton.left = leftX + 14;
            fieldButton.top = entryBottom + 8;
            leftContent.addChild( fieldButton );
            const fieldValue = new Text( field[ 1 ], {
              font: readableFont( 9 ), fill: '#294957', left: leftX + 14,
              top: fieldButton.bottom + 8, maxWidth: sideWidth - 28
            } );
            leftContent.addChild( fieldValue );
            const editField = makeButton( 'EDIT THIS ENTRY', () => {
              field[ 2 ]();
              renderLeft();
            }, '#EAF5F8', 9 );
            editField.left = leftX + 14;
            editField.top = fieldValue.bottom + 8;
            leftContent.addChild( editField );
            const createProduct = makeButton( 'CREATE FINAL PRODUCT', () => {
              if ( model.createProjectProduct() ) {
                model.projectPageProperty.value = 'product';
                model.rightPanelProperty.value = 'project';
              }
              renderLeft();
              renderRight();
            }, '#BCEACB', 9 );
            createProduct.left = leftX + 14;
            createProduct.top = editField.bottom + 8;
            createProduct.enabled = model.trialsProperty.value.length >= model.requiredTrialsProperty.value && milestones[ 4 ] && milestones[ 5 ] && milestones[ 6 ];
            leftContent.addChild( createProduct );
          }
          const backToProject = makeButton( 'BACK TO PROJECT MILESTONES', () => {
            model.projectPageProperty.value = 'investigate';
            renderLeft();
          }, '#EAF5F8', 8 );
          backToProject.left = leftX + 14;
          backToProject.bottom = panelTop + panelHeight - 8;
          leftContent.addChild( backToProject );
        }
        else if ( model.projectPageProperty.value === 'rescue' ) {
          const rescueMessage = new Text( milestones[ 6 ] ? 'The cell met its rescue target. Explain which evidence shows recovery.' : 'The rescue is in the lab. Test the repair, wait for gradual response, and compare the live data.', {
            font: readableBoldFont( 9 ), fill: '#294957', left: leftX + 14, top: pageHeading.bottom + 10,
            maxWidth: sideWidth - 28
          } );
          leftContent.addChild( rescueMessage );
          const evidenceButton = makeButton( 'OPEN LIVE DATA', () => {
            model.rightPanelProperty.value = 'data';
            renderRight();
          }, '#DDF3FA', 9 );
          evidenceButton.left = leftX + 14;
          evidenceButton.top = rescueMessage.bottom + 12;
          leftContent.addChild( evidenceButton );
          const notebookButton = makeButton( 'OPEN PROJECT NOTEBOOK', openProjectNotebook, '#FFE8A3', 9 );
          notebookButton.left = leftX + 14;
          notebookButton.top = evidenceButton.bottom + 7;
          leftContent.addChild( notebookButton );
          const rescueReturnButton = makeButton( milestones[ 6 ] ? 'RESCUE TEST COMPLETE ✓' : 'RETURN TO RESCUE LAB', () => {
            model.modeProperty.value = 'challenge';
            model.experimentPanelProperty.value = 'controls';
            renderLeft();
          }, '#FFE080', 9 );
          rescueReturnButton.left = leftX + 14;
          rescueReturnButton.bottom = panelTop + panelHeight - 8;
          rescueReturnButton.enabled = !milestones[ 6 ];
          leftContent.addChild( rescueReturnButton );
        }
        else {
          const productTitle = new Text( 'FINAL PRODUCT  ·  ' + model.projectProductProperty.value, {
            font: readableBoldFont( 10 ), fill: '#294957', left: leftX + 14, top: pageHeading.bottom + 10,
            maxWidth: sideWidth - 28
          } );
          leftContent.addChild( productTitle );
          const productChoice = makeButton( 'CHOOSE A DIFFERENT PRODUCT', () => {
            const products = AnimalCellModel.PROJECT_PRODUCTS;
            const productIndex = products.indexOf( model.projectProductProperty.value );
            model.projectProductProperty.value = products[ ( productIndex + 1 ) % products.length ];
            renderLeft();
          }, '#EAF5F8', 8 );
          productChoice.left = leftX + 14;
          productChoice.top = productTitle.bottom + 7;
          leftContent.addChild( productChoice );
          const conclusionButton = makeButton( 'EDIT EVIDENCE-BASED CONCLUSION', () => {
            model.cycleProjectNote( 'conclusion' );
            renderLeft();
          }, '#EAF5F8', 8 );
          conclusionButton.left = leftX + 14;
          conclusionButton.top = productChoice.bottom + 6;
          leftContent.addChild( conclusionButton );
          const createButton = makeButton( 'CREATE FINAL PRODUCT', () => {
            if ( model.createProjectProduct() ) {
              model.rightPanelProperty.value = 'project';
            }
            renderLeft();
            renderRight();
          }, '#BCEACB', 9 );
          createButton.left = leftX + 14;
          createButton.top = conclusionButton.bottom + 6;
          createButton.enabled = model.trialsProperty.value.length >= model.requiredTrialsProperty.value && milestones[ 4 ] && milestones[ 5 ] && milestones[ 6 ] &&
                                model.cerEvidenceProperty.value !== 'Use the before-and-after values as evidence.' &&
                                model.cerReasoningProperty.value !== 'The changed process is connected to the output I measured.';
          leftContent.addChild( createButton );
          const defendButton = makeButton( milestones[ 8 ] ? 'PROJECT DEFENDED ✓' : 'PRESENT AND DEFEND', () => {
            model.defendProject();
            renderLeft();
            renderRight();
          }, '#FFE080', 9 );
          defendButton.left = leftX + 14;
          defendButton.bottom = panelTop + panelHeight - 8;
          defendButton.enabled = milestones[ 7 ];
          leftContent.addChild( defendButton );
        }
        return;
      }
      if ( mode === 'explore' ) {
        const exploreKeys = [ 'oxygen', 'glucose', 'water', 'ph', 'temperature', 'mitochondria', 'ribosomes', 'golgi', 'lysosomes', 'permeability' ];
        const currentDefinition = AnimalCellModel.VARIABLE_DEFINITIONS.find( item => item.key === model.selectedVariableProperty.value ) || AnimalCellModel.VARIABLE_DEFINITIONS[ 0 ];
        const advancedExplore = model.advancedExploreProperty.value;
        if ( advancedExplore ) {
          const advancedButton = makeButton( 'BACK TO ONE-VARIABLE TEST', () => {
            model.advancedExploreProperty.value = false;
            advancedTrialSaved = false;
            startFreshExploreTrial();
            exploreStep = 1;
            renderLeft();
          }, '#EAF5F8', 10 );
          advancedButton.left = leftX + 14;
          advancedButton.top = panelTop + 50;
          leftContent.addChild( advancedButton );
          const advancedActionLabel = model.trialLockedProperty.value ? ( advancedTrialSaved ? 'NEW TRIAL' : 'SAVE TRIAL' ) : 'RUN EXPERIMENT';
          const runButton = makeButton( advancedActionLabel, () => {
            if ( model.trialLockedProperty.value ) {
              if ( advancedTrialSaved ) {
                startFreshExploreTrial();
                advancedTrialSaved = false;
                model.rightPanelProperty.value = 'data';
              }
              else {
                model.recordTrial();
                advancedTrialSaved = true;
                trialPanelPage = 'records';
                model.rightPanelProperty.value = 'notebook';
                renderRight();
              }
              renderLeft();
            }
            else {
              runCurrentTrial();
              renderLeft();
            }
          }, model.trialLockedProperty.value ? '#BCEACB' : '#FFE8A3', 11 );
          runButton.left = leftX + 14;
          runButton.bottom = panelTop + panelHeight - 8;
          leftContent.addChild( runButton );
        }
        else {
          const stepNames = {
            1: 'QUESTION', 2: 'PREDICT', 3: 'CHANGE ONE VARIABLE', 4: 'RUN EXPERIMENT',
            5: 'WATCH THE CELL', 6: 'READ THE DATA', 7: 'COMPARE BEFORE / AFTER',
            8: 'EXPLAIN', 9: 'SAVE TRIAL'
          };
          exploreStepLabel = new Text( 'STEP ' + exploreStep + ' OF 9  ·  ' + stepNames[ exploreStep ], {
            font: readableBoldFont( 10 ), fill: '#125F7B', left: leftX + 14, top: panelTop + 46,
            maxWidth: sideWidth - 28
          } );
          leftContent.addChild( exploreStepLabel );

          const chooseInputButton = makeButton( currentDefinition.label + '  ▾', () => {
            variableMenuOpen = !variableMenuOpen;
            renderLeft();
          }, '#DDF3FA', 10 );
          chooseInputButton.left = leftX + 14;
          chooseInputButton.top = panelTop + 76;
          chooseInputButton.enabled = !model.trialLockedProperty.value;
          leftContent.addChild( chooseInputButton );
          if ( variableMenuOpen && !model.trialLockedProperty.value ) {
            AnimalCellModel.VARIABLE_DEFINITIONS.filter( definition => exploreKeys.includes( definition.key ) ).forEach( ( definition, index ) => {
              const option = makeButton( definition.label, () => {
                model.selectedVariableProperty.value = definition.key;
                startFreshExploreTrial();
                exploreStep = 1;
                variableMenuOpen = false;
                renderLeft();
              }, definition.key === currentDefinition.key ? '#9EE2F0' : '#EAF5F8', 9, sideWidth / 2 - 34 );
              option.left = leftX + 14 + ( index % 2 ) * ( sideWidth / 2 - 10 );
              option.top = chooseInputButton.bottom + 3 + Math.floor( index / 2 ) * 43;
              leftContent.addChild( option );
            } );
            renderSliders( mode );
            return;
          }

          const question = new Text( 'QUESTION  ·  Effect of ' + currentDefinition.label.toLowerCase() + ' on ' + currentDefinition.output + '?', {
            font: readableBoldFont( 9 ), fill: '#294957', left: leftX + 14, top: chooseInputButton.bottom + 7,
            maxWidth: sideWidth - 28
          } );
          leftContent.addChild( question );
          const controlled = new Text( 'CONTROLLED  ·  Other inputs stay at baseline.', {
            font: readableFont( 8 ), fill: '#315C48', left: leftX + 14, top: question.bottom + 4,
            maxWidth: sideWidth - 28
          } );
          leftContent.addChild( controlled );
          const predictionLabel = new Text( 'PREDICT  ·  What will ' + currentDefinition.output.toLowerCase() + ' do?', {
            font: readableBoldFont( 9 ), fill: '#294957', left: leftX + 14, top: controlled.bottom + 8,
            maxWidth: sideWidth - 28
          } );
          leftContent.addChild( predictionLabel );
          const predictionButtons = [ [ 'Increase', 'increase' ], [ 'Decrease', 'decrease' ], [ 'No change', 'stay the same' ] ].map( item => makeButton( item[ 0 ], () => {
              model.makePrediction( item[ 1 ] );
              const baselineValue = model.trialStartSettingsProperty.value[ currentDefinition.key ];
              exploreStep = model.variables[ currentDefinition.key ].value === baselineValue ? 3 : 4;
              if ( exploreStepLabel ) {
                exploreStepLabel.string = 'STEP ' + exploreStep + ' OF 9  ·  ' + ( exploreStep === 3 ? 'CHANGE ONE VARIABLE' : 'RUN EXPERIMENT' );
              }
              renderLeft();
            }, model.predictionProperty.value === item[ 1 ] ? '#B5E8C0' : '#EAF5F8', 8 ) );
          const predictionRow = new HBox( {
            children: predictionButtons.slice( 0, 2 ), spacing: 4, left: leftX + 14, top: predictionLabel.bottom + 4
          } );
          const noChangeRow = new HBox( {
            children: [ predictionButtons[ 2 ] ], left: leftX + 14, top: predictionRow.bottom + 2
          } );
          leftContent.addChild( predictionRow );
          leftContent.addChild( noChangeRow );

          const before = model.trialStartProperty.value || model.getOutputSnapshot();
          const after = model.getOutputSnapshot();
          const primaryKey = currentDefinition.outputKey;
          const resultText = new Text( '', {
            font: readableBoldFont( 8 ), fill: '#294957', left: leftX + 14,
            top: panelTop + 405, maxWidth: sideWidth - 28
          } );
          if ( exploreStep >= 5 ) {
            resultText.string = exploreStep === 5 ? 'WATCH CELL  ·  Follow the highlighted pathway.' :
                                'BEFORE → NOW  ·  ' + currentDefinition.output + ': ' + roundSymmetric( before[ primaryKey ] ) + '% → ' + roundSymmetric( after[ primaryKey ] ) + '%\nModel health score: ' + roundSymmetric( before.health ) + '% → ' + roundSymmetric( after.health ) + '%\nCell status: ' + before.status + ' → ' + after.status + ( exploreStep === 8 ? '\nEXPLAIN: How does the data support your prediction?' : '' );
            leftContent.addChild( resultText );
          }

          const nextLabel = exploreStep === 9 ? 'NEW TRIAL' : exploreStep === 8 ? 'SAVE TRIAL' : exploreStep === 4 ? 'RUN EXPERIMENT' :
                            exploreStep === 5 ? 'CONTINUE: READ DATA' : exploreStep === 6 ? 'CONTINUE: COMPARE' : exploreStep === 7 ? 'CONTINUE: EXPLAIN' : 'RUN EXPERIMENT';
          const runButton = makeButton( nextLabel, () => {
            if ( exploreStep === 9 ) {
              startFreshExploreTrial();
              exploreStep = 1;
              trialPanelPage = 'design';
              renderLeft();
            }
            else if ( exploreStep === 5 || exploreStep === 6 ) {
              exploreStep++;
              renderLeft();
            }
            else if ( exploreStep === 7 ) {
              const definition = AnimalCellModel.VARIABLE_DEFINITIONS.find( item => item.key === model.selectedVariableProperty.value ) || AnimalCellModel.VARIABLE_DEFINITIONS[ 0 ];
              model.comparePrediction( definition.outputKey );
              exploreStep = 8;
              renderLeft();
            }
            else if ( exploreStep === 8 ) {
              model.recordTrial();
              model.pathwayHighlightProperty.value = null;
              exploreStep = 9;
              trialPanelPage = 'records';
              model.rightPanelProperty.value = 'notebook';
              renderLeft();
              renderRight();
            }
            else {
              runCurrentTrial();
              renderLeft();
            }
          }, exploreStep === 9 ? '#BCEACB' : '#FFE8A3', 10 );
          runButton.left = leftX + 14;
          runButton.bottom = panelTop + panelHeight - 8;
          runButton.enabled = exploreStep === 9 || ( exploreStep === 5 && model.responseReadyProperty.value ) ||
                              exploreStep === 6 || exploreStep === 7 || exploreStep === 8 ||
                              ( exploreStep === 4 && model.predictionProperty.value !== null );
          leftContent.addChild( runButton );
        }
        renderSliders( mode );
        return;
      }
      if ( mode === 'challenge' ) {
        const challenge = model.challengeProperty.value;
        if ( !challenge ) {
          leftContent.addChild( new Text( 'YOUR MISSION  ·  Restore the cell using evidence.', {
            font: readableBoldFont( 10 ), fill: '#294957', left: leftX + 14, top: panelTop + 48,
            maxWidth: sideWidth - 28
          } ) );
          leftContent.addChild( makeButton( 'START RESCUE CASE', () => {
            model.startRescueChallenge();
            renderLeft();
          }, '#FFE080', 10 ).mutate( { left: leftX + 14, top: panelTop + 92 } ) );
          renderSliders( mode );
          return;
        }
        const clueText = new Text( 'YOUR MISSION  ·  ' + challenge.mission + '\n' + challenge.clue, {
          font: readableBoldFont( 9 ), fill: '#294957', left: leftX + 14, top: panelTop + 46,
          maxWidth: sideWidth - 28
        } );
        leftContent.addChild( clueText );
        const rescueMetricLabel = challenge.outputKey === 'atp' ? 'ATP / energy' :
                                  challenge.outputKey === 'waste' ? 'Waste buildup' :
                                  challenge.outputKey === 'protein' ? 'Protein production' :
                                  challenge.outputKey === 'export' ? 'Protein export' : 'Cell volume';
        const evidence = new Text( 'STEP 1 — OBSERVE  ·  EVIDENCE  ·  ' + rescueMetricLabel + ': ' +
                                   roundSymmetric( model[ challenge.outputKey + 'Property' ].value ) + '%   ·   Cell health: ' + roundSymmetric( model.healthProperty.value ) + '%', {
          font: readableFont( 8 ), fill: '#294957', left: leftX + 14, top: clueText.bottom + 7,
          maxWidth: sideWidth - 28
        } );
        leftContent.addChild( evidence );
        const successTarget = new Text( 'SUCCESS TARGET  ·  ' + challenge.target, {
          font: readableBoldFont( 8 ), fill: '#315C48', left: leftX + 14, top: evidence.bottom + 5,
          maxWidth: sideWidth - 28
        } );
        leftContent.addChild( successTarget );
        const chooseTitle = new Text( 'STEP 2 — Choose ONE possible cause', {
          font: readableBoldFont( 9 ), fill: '#125F7B', left: leftX + 14, top: successTarget.bottom + 7,
          maxWidth: sideWidth - 28
        } );
        leftContent.addChild( chooseTitle );
        challenge.candidates.forEach( ( key, index ) => {
          const definition = AnimalCellModel.VARIABLE_DEFINITIONS.find( item => item.key === key );
          const shortCauseLabel = definition.label.replace( ' function', '' ).replace( ' availability', '' ).replace( ' condition', '' ).replace( 'Membrane permeability', 'Membrane' ).replace( 'Outside water level', 'Outside water' );
          const causeButton = makeButton( shortCauseLabel, () => {
            model.selectedVariableProperty.value = key;
            renderLeft();
          }, model.selectedVariableProperty.value === key ? '#B5E8C0' : '#EAF5F8', 8, sideWidth / 2 - 38 );
          causeButton.left = leftX + 14 + index % 2 * ( sideWidth / 2 - 10 );
          causeButton.top = chooseTitle.bottom + 4 + Math.floor( index / 2 ) * 36;
          causeButton.enabled = !model.trialLockedProperty.value;
          leftContent.addChild( causeButton );
        } );
        const selectedDefinition = AnimalCellModel.VARIABLE_DEFINITIONS.find( item => item.key === model.selectedVariableProperty.value );
        const stepNote = new Text( selectedDefinition ? 'STEP 3 — Adjust only: ' + selectedDefinition.label : 'Select a possible cause to reveal its single control.', {
          font: readableFont( 8 ), fill: '#435E69', left: leftX + 14,
          top: chooseTitle.bottom + 78, maxWidth: sideWidth - 28
        } );
        leftContent.addChild( stepNote );
        const rescueStart = model.trialStartProperty.value || model.getOutputSnapshot();
        const rescueCurrent = model.getOutputSnapshot();
        const rescueMetricShort = challenge.outputKey === 'atp' ? 'ATP' : challenge.outputKey === 'waste' ? 'Waste' : challenge.outputKey === 'protein' ? 'Protein' : challenge.outputKey === 'export' ? 'Export' : 'Volume';
        const rescueComparison = new Text( 'BEFORE → NOW  ·  ' + rescueMetricShort + ': ' + roundSymmetric( rescueStart[ challenge.outputKey ] ) + '% → ' + roundSymmetric( rescueCurrent[ challenge.outputKey ] ) + '%\nHealth: ' + roundSymmetric( rescueStart.health ) + '% → ' + roundSymmetric( rescueCurrent.health ) + '%', {
          font: readableFont( 8 ), fill: '#294957', left: leftX + 14,
          top: panelTop + 397, maxWidth: sideWidth - 28
        } );
        leftContent.addChild( rescueComparison );
        const rescueFeedback = new Text( model.challengeFeedbackProperty.value, {
          font: readableBoldFont( 8 ), fill: '#355967', left: leftX + 14,
          top: panelTop + 441, maxWidth: sideWidth - 28
        } );
        leftContent.addChild( rescueFeedback );
        const rescueButton = makeButton( model.trialLockedProperty.value ? 'NEXT RESCUE CASE' : 'STEP 4 · RUN TEST', () => {
          if ( model.trialLockedProperty.value ) {
            model.startRescueChallenge();
            model.rightPanelProperty.value = 'data';
            renderLeft();
          }
          else if ( model.selectedVariableProperty.value ) {
            model.testRescue();
            renderLeft();
            renderRight();
          }
        }, model.trialLockedProperty.value ? '#BCEACB' : '#FFE8A3', 10 );
        rescueButton.left = leftX + 14;
        rescueButton.bottom = panelTop + panelHeight - 8;
        rescueButton.enabled = model.trialLockedProperty.value || !!model.selectedVariableProperty.value;
        leftContent.addChild( rescueButton );
        renderSliders( mode );
        return;
      }
      if ( mode === 'whatif' ) {
        const scenario = model.selectedScenarioProperty.value;
        const definition = AnimalCellModel.VARIABLE_DEFINITIONS.find( item => item.key === scenario.variable );
        const stepNames = { 2: 'PREDICT', 3: 'CHANGE ONE VARIABLE', 4: 'RUN EXPERIMENT', 5: 'WATCH THE CELL', 6: 'READ THE DATA', 7: 'COMPARE BEFORE / AFTER', 8: 'EXPLAIN', 9: 'SAVE TRIAL' };
        const stepLabel = new Text( 'STEP ' + whatifStep + ' OF 9  ·  ' + stepNames[ whatifStep ], {
          font: readableBoldFont( 10 ), fill: '#125F7B', left: leftX + 14, top: panelTop + 46,
          maxWidth: sideWidth - 28
        } );
        leftContent.addChild( stepLabel );
        const question = new Text( 'WHAT HAPPENS IF…?\n' + scenario.question, {
          font: readableBoldFont( 10 ), fill: '#294957', left: leftX + 14, top: stepLabel.bottom + 9,
          maxWidth: sideWidth - 28
        } );
        leftContent.addChild( question );
        const predictionLabel = new Text( 'STEP 2 — Predict the effect on ' + definition.output + '.', {
          font: readableBoldFont( 9 ), fill: '#294957', left: leftX + 14, top: question.bottom + 8,
          maxWidth: sideWidth - 28
        } );
        leftContent.addChild( predictionLabel );
        const whatifPredictionButtons = [ [ 'Increase', 'increase' ], [ 'Decrease', 'decrease' ], [ 'No change', 'stay the same' ] ].map( item => makeButton( item[ 0 ], () => {
            if ( whatifStep > 3 ) {
              return;
            }
            model.makePrediction( item[ 1 ] );
            whatifStep = 4;
            renderLeft();
          }, model.predictionProperty.value === item[ 1 ] ? '#B5E8C0' : '#EAF5F8', 8 ) );
        const predictionRow = new HBox( {
          children: whatifPredictionButtons.slice( 0, 2 ), spacing: 4, left: leftX + 14, top: predictionLabel.bottom + 4
        } );
        const noChangeRow = new HBox( {
          children: [ whatifPredictionButtons[ 2 ] ], left: leftX + 14, top: predictionRow.bottom + 2
        } );
        leftContent.addChild( predictionRow );
        leftContent.addChild( noChangeRow );
        const inputPlan = new Text( 'STEP 3 — Test only ' + definition.label + ' at ' + inputDisplayValue( scenario.variable, scenario.value ) + '. Other inputs stay at baseline.', {
          font: readableFont( 8 ), fill: '#315C48', left: leftX + 14,
          top: noChangeRow.bottom + 8, maxWidth: sideWidth - 28
        } );
        leftContent.addChild( inputPlan );
        if ( whatifStep >= 5 ) {
          const before = model.trialStartProperty.value || model.getOutputSnapshot();
          const after = model.getOutputSnapshot();
          const comparison = new Text( whatifStep === 5 ? 'WATCH CELL  ·  Follow the pathway. Wait 2–5 seconds.' :
                                       'BEFORE → NOW  ·  ' + definition.output + ': ' + roundSymmetric( before[ scenario.output ] ) + '% → ' + roundSymmetric( after[ scenario.output ] ) + '%\nHealth: ' + roundSymmetric( before.health ) + '% → ' + roundSymmetric( after.health ) + '%', {
            font: readableBoldFont( 8 ), fill: '#294957', left: leftX + 14,
            top: Math.max( panelTop + 285, inputPlan.bottom + 7 ), maxWidth: sideWidth - 28
          } );
          leftContent.addChild( comparison );
          let compareFeedback = null;
          if ( whatifStep >= 7 ) {
            compareFeedback = new Text( model.feedbackProperty.value, {
              font: readableFont( 8 ), fill: '#355967', left: leftX + 14,
              top: comparison.bottom + 4, maxWidth: sideWidth - 28
            } );
            leftContent.addChild( compareFeedback );
          }
          if ( whatifStep === 8 ) {
            leftContent.addChild( new Text( 'STEP 8 — EXPLAIN  ·  Which measured change supports your prediction, and why?', {
              font: readableBoldFont( 8 ), fill: '#294957', left: leftX + 14,
              top: compareFeedback ? compareFeedback.bottom + 5 : comparison.bottom + 5,
              maxWidth: sideWidth - 28
            } ) );
          }
        }
        const actionLabel = whatifStep === 9 ? 'NEXT QUESTION' : whatifStep === 8 ? 'SAVE TRIAL' :
                            whatifStep === 7 ? 'CONTINUE: EXPLAIN' : whatifStep === 6 ? 'COMPARE BEFORE / AFTER' :
                            whatifStep === 5 ? 'CONTINUE: READ DATA' : 'RUN EXPERIMENT';
        const action = makeButton( actionLabel, () => {
          if ( whatifStep === 2 || whatifStep === 3 || whatifStep === 4 ) {
            if ( !model.predictionProperty.value ) {
              model.feedbackProperty.value = 'Choose a prediction before running the experiment.';
              return;
            }
            if ( whatifStep === 4 ) {
              model.runScenario();
              model.triggerFocusEffect( scenario.variable );
              model.pathwayHighlightProperty.value = scenario.output === 'atp' ? 'energy' : scenario.output === 'waste' ? 'waste' : scenario.output === 'volume' || scenario.output === 'balance' ? 'transport' : 'protein';
              whatifStep = 5;
            }
          }
          else if ( whatifStep === 5 ) {
            whatifStep = 6;
          }
          else if ( whatifStep === 6 ) {
            model.comparePrediction( scenario.output );
            whatifStep = 7;
          }
          else if ( whatifStep === 7 ) {
            whatifStep = 8;
          }
          else if ( whatifStep === 8 ) {
            model.recordTrial();
            model.pathwayHighlightProperty.value = null;
            whatifStep = 9;
            trialPanelPage = 'records';
            model.rightPanelProperty.value = 'notebook';
            renderRight();
          }
          else if ( whatifStep === 9 ) {
            const scenarios = AnimalCellModel.SCENARIOS;
            const index = scenarios.findIndex( item => item.id === scenario.id );
            model.setScenario( scenarios[ ( index + 1 ) % scenarios.length ].id );
            whatifStep = 2;
            model.rightPanelProperty.value = 'data';
          }
          renderLeft();
        }, whatifStep === 9 ? '#BCEACB' : '#FFE8A3', 9 );
        action.left = leftX + 14;
        action.bottom = panelTop + panelHeight - 8;
        action.enabled = whatifStep === 9 || ( whatifStep === 5 && model.responseReadyProperty.value ) ||
                         whatifStep === 6 || whatifStep === 7 || whatifStep === 8 ||
                         ( whatifStep === 4 && model.predictionProperty.value !== null );
        leftContent.addChild( action );
        renderSliders( mode );
        return;
      }
      let taskTop = panelTop + 50;
      if ( mode !== 'learn' ) {
        const tabY = panelTop + 47;
        const tabButtons = [
          [ 'Environment', 'environment' ], [ 'Conditions', 'conditions' ], [ 'Cell parts', 'organelles' ]
        ].map( item => makeButton( item[ 0 ], () => {
          model.controlGroupProperty.value = item[ 1 ];
          model.rightPanelProperty.value = 'data';
        }, model.controlGroupProperty.value === item[ 1 ] ? '#9EE2F0' : '#EAF5F8', 10 ) );
        const tabs = new HBox( { children: tabButtons, spacing: 3, left: leftX + 9, top: tabY } );
        leftContent.addChild( tabs );
        taskTop = tabs.bottom + 8;
      }
      if ( mode === 'whatif' || mode === 'challenge' || mode === 'explore' ) {
        const taskTabs = [
          [ mode === 'whatif' ? 'Question' : mode === 'challenge' ? 'Diagnose' : 'Guide', 'question' ],
          [ 'Adjust variables', 'controls' ]
        ].map( item => makeButton( item[ 0 ], () => {
          model.experimentPanelProperty.value = item[ 1 ];
          renderLeft();
        }, model.experimentPanelProperty.value === item[ 1 ] ? '#BFEAF2' : '#EAF5F8', 9 ) );
        const taskRow = new HBox( { children: taskTabs, spacing: 4, left: leftX + 10, top: taskTop } );
        leftContent.addChild( taskRow );
        taskTop = taskRow.bottom + 6;
      }

      if ( mode === 'learn' ) {
        const learnText = new Text( 'Select an organelle in the cell. Its ORGANELLE DETAILS appear here with its function, system connection, and what changes if it fails.', {
          font: readableFont( 13 ), fill: '#435E69', maxWidth: sideWidth - 28,
          left: leftX + 14, top: taskTop
        } );
        leftContent.addChild( learnText );
        const modelNote = new Text( 'Model note: cells use RNA messages between DNA instructions and ribosomes. Pathways here are simplified for learning.', {
          font: readableFont( 11 ), fill: '#5A6570', maxWidth: sideWidth - 28,
          left: leftX + 14, top: learnText.bottom + 20
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
      if ( mode === 'explore' && variableMenuOpen ) {
        return;
      }
      if ( mode === 'learn' || ( ( mode === 'whatif' || mode === 'explore' ) && model.experimentPanelProperty.value !== 'controls' ) || ( mode === 'challenge' && !model.selectedVariableProperty.value ) ) {
        return;
      }
      const exploreKeys = [ 'oxygen', 'glucose', 'water', 'ph', 'temperature', 'mitochondria', 'ribosomes', 'golgi', 'lysosomes', 'permeability' ];
      const definitions = mode === 'explore' ?
                          ( model.advancedExploreProperty.value ? exploreKeys.map( key => AnimalCellModel.VARIABLE_DEFINITIONS.find( item => item.key === key ) ) : [ AnimalCellModel.VARIABLE_DEFINITIONS.find( item => item.key === model.selectedVariableProperty.value ) ] ) :
                          mode === 'challenge' ? [ AnimalCellModel.VARIABLE_DEFINITIONS.find( item => item.key === model.selectedVariableProperty.value ) ] :
                          model.getDefinitions( model.controlGroupProperty.value );
      const allowed = new Set( model.enabledVariablesProperty.value );
      const visibleDefinitions = definitions.filter( definition => allowed.has( definition.key ) );
      const advancedExplore = mode === 'explore' && model.advancedExploreProperty.value;
      const startY = mode === 'explore' ? ( advancedExplore ? panelTop + 120 : panelTop + 300 ) : mode === 'challenge' ? panelTop + 328 : panelTop + 190;
      const rowHeight = mode === 'explore' ?
                       ( panelTop + panelHeight - startY - ( advancedExplore ? 8 : 92 ) ) / Math.max( visibleDefinitions.length, 1 ) :
                       Math.min( 60, ( panelTop + panelHeight - startY - 8 ) / Math.max( visibleDefinitions.length, 1 ) );
      visibleDefinitions.forEach( ( definition, index ) => {
        const y = startY + index * rowHeight;
        const label = new Text( definition.label, {
          font: readableBoldFont( mode === 'explore' ? 10 : 11 ), fill: '#183A4B', left: leftX + 12, top: y,
          maxWidth: sideWidth - 65
        } );
        const value = new Text( '', {
          font: readableBoldFont( mode === 'explore' ? 19 : 17 ), fill: '#125F7B',
          right: leftX + sideWidth - 12, top: y
        } );
        const property = model.variables[ definition.key ];
        value.string = inputDisplayValue( definition.key, property.value );
        const updateValue = current => {
          value.string = inputDisplayValue( definition.key, current );
          model.selectedVariableProperty.value = definition.key;
          if ( mode === 'explore' || mode === 'challenge' ) {
            model.triggerFocusEffect( definition.key );
            model.pathwayHighlightProperty.value = definition.key === 'oxygen' || definition.key === 'glucose' || definition.key === 'mitochondria' ? 'energy' :
                                                   definition.key === 'lysosomes' ? 'waste' :
                                                   definition.key === 'water' || definition.key === 'permeability' ? 'transport' : 'protein';
            const baselineValue = model.trialStartSettingsProperty.value && model.trialStartSettingsProperty.value[ definition.key ];
            if ( mode === 'explore' && !model.trialLockedProperty.value && current !== baselineValue && model.predictionProperty.value ) {
              exploreStep = 4;
              if ( exploreStepLabel ) {
                exploreStepLabel.string = 'STEP 4 OF 9  ·  RUN EXPERIMENT';
              }
            }
            if ( mode === 'challenge' ) {
              model.applyCurrentInputs();
            }
          }
        };
        property.lazyLink( updateValue );
        sliderUnlinks.push( () => property.unlink( updateValue ) );
        const slider = new HSlider( property, new Range( definition.min === undefined ? 0 : definition.min, definition.max === undefined ? 100 : definition.max ), {
          trackSize: new Dimension2( sideWidth - 68, 6 ),
          thumbSize: new Dimension2( 24, mode === 'explore' ? 22 : 26 ),
          constrainValue: input => roundSymmetric( input / ( definition.step || 5 ) ) * ( definition.step || 5 )
        } );
        slider.left = leftX + 12;
        slider.top = mode === 'explore' ? y + ( advancedExplore ? 20 : 21 ) : label.bottom + 3;
        if ( ( mode === 'explore' || mode === 'challenge' ) && model.trialLockedProperty.value ) {
          slider.pickable = false;
        }
        if ( mode !== 'explore' && mode !== 'challenge' ) {
          sliderRoot.addChild( new Text( 'Affects: ' + definition.output, {
            font: readableFont( 8 ), fill: '#526A73', left: leftX + 12,
            top: slider.bottom + 1, maxWidth: sideWidth - 24
          } ) );
        }
        sliderRoot.addChild( label );
        sliderRoot.addChild( value );
        sliderRoot.addChild( slider );
        if ( mode === 'explore' && !advancedExplore && definition.max !== definition.min ) {
          const healthyPosition = slider.left + ( definition.value - definition.min ) / ( definition.max - definition.min ) * slider.width;
          sliderRoot.addChild( new Path( Shape.lineSegment(
            new Vector2( healthyPosition, slider.top - 7 ),
            new Vector2( healthyPosition, slider.bottom + 7 )
          ), { stroke: '#28734C', lineWidth: 2, pickable: false } ) );
        }
        if ( mode === 'explore' && !advancedExplore ) {
          sliderRoot.addChild( new Text( inputDisplayValue( definition.key, definition.min === undefined ? 0 : definition.min ), {
            font: readableFont( 8 ), fill: '#526A73', left: slider.left, top: slider.bottom + 3
          } ) );
          sliderRoot.addChild( new Text( inputDisplayValue( definition.key, definition.max === undefined ? 100 : definition.max ), {
            font: readableFont( 8 ), fill: '#526A73', right: slider.right, top: slider.bottom + 3
          } ) );
        }
        if ( ( mode === 'explore' && !advancedExplore ) || mode === 'challenge' ) {
          sliderRoot.addChild( new Text( healthyRangeFor( definition.key ), {
            font: readableFont( 8 ), fill: '#315C48', left: leftX + 12,
            top: slider.bottom + 7, maxWidth: sideWidth - 24
          } ) );
        }
      } );
    };

    let rightPanelUnlinks = [];
    const linkPanelProperty = ( property, listener ) => {
      property.lazyLink( listener );
      rightPanelUnlinks.push( () => property.unlink( listener ) );
    };
    const renderProjectPanel = ( root, tabRow ) => {
      const projectCase = model.projectCaseProperty.value;
      const milestones = model.projectMilestonesProperty.value;
      const milestoneNames = [ 'Understand the problem', 'Ask testable questions', 'Run first experiment', 'Collect at least three trials', 'Identify evidence patterns', 'Propose a diagnosis', 'Test the rescue plan', 'Create final product', 'Present and defend' ];
      const sections = [ 'Milestones', 'Team & teacher setup', 'Trial evidence', 'CER report', 'Conclusion & print', 'Assessment rubric' ];
      const sectionButton = makeButton( 'PROJECT NOTEBOOK  ·  ' + sections[ projectPanelPage ] + '  ▸', () => {
        projectPanelPage = ( projectPanelPage + 1 ) % sections.length;
        renderRight();
      }, '#EAF5F8', 8 );
      sectionButton.left = rightX + 13;
      sectionButton.top = tabRow.bottom + 7;
      root.addChild( sectionButton );
      let y = sectionButton.bottom + 8;
      const addProjectText = ( text, font, color = '#294957', maxWidth = sideWidth - 26 ) => {
        const entry = new Text( text, { font: font, fill: color, left: rightX + 13, top: y, maxWidth: maxWidth } );
        root.addChild( entry );
        y = entry.bottom + 5;
        return entry;
      };
      const addProjectButton = ( text, listener, color = '#EAF5F8' ) => {
        const button = makeButton( text, listener, color, 8 );
        button.left = rightX + 13;
        button.top = y;
        root.addChild( button );
        y = button.bottom + 5;
        return button;
      };

      if ( projectPanelPage === 0 ) {
        addProjectText( 'CELL SURVIVAL CHALLENGE\n' + projectCase.title + '\n' + projectCase.symptoms, readableBoldFont( 8 ), '#294957' );
        milestoneNames.forEach( ( name, index ) => {
          addProjectText( ( milestones[ index ] ? '✓  ' : '○  ' ) + ( index + 1 ) + '. ' + name, readableFont( 8 ), milestones[ index ] ? '#235B3D' : '#526A73' );
        } );
      }
      else if ( projectPanelPage === 1 ) {
        const roleRotation = model.projectRoleRotationProperty.value;
        addProjectText( 'CELL RESPONSE TEAM · ROTATING ROLES', readableBoldFont( 8 ), '#125F7B' );
        AnimalCellModel.PROJECT_ROLES.forEach( ( role, index ) => {
          addProjectText( role + '  ·  Member ' + ( ( index + roleRotation ) % AnimalCellModel.PROJECT_ROLES.length + 1 ), readableFont( 8 ) );
        } );
        addProjectButton( 'ROTATE GROUP ROLES', () => {
          model.projectRoleRotationProperty.value = ( roleRotation + 1 ) % AnimalCellModel.PROJECT_ROLES.length;
          renderRight();
        } );
        addProjectButton( 'TEACHER MODE  ·  ' + ( model.teacherModeProperty.value ? 'ON' : 'OFF' ), () => {
          model.teacherModeProperty.value = !model.teacherModeProperty.value;
          renderRight();
        }, model.teacherModeProperty.value ? '#FFE080' : '#EAF5F8' );
        if ( !model.teacherModeProperty.value ) {
          addProjectText( 'Teacher setup is available when Teacher Mode is on. Student evidence and milestone status remain visible in this notebook.', readableFont( 8 ) );
          return;
        }
        addProjectButton( 'REQUIRED TRIALS  ·  ' + model.requiredTrialsProperty.value + '  ▸', () => {
          model.requiredTrialsProperty.value = model.requiredTrialsProperty.value >= 5 ? 3 : model.requiredTrialsProperty.value + 1;
          renderRight();
        } );
        addProjectButton( 'FINAL PRODUCT  ·  ' + model.projectProductProperty.value + '  ▸', () => {
          const products = AnimalCellModel.PROJECT_PRODUCTS;
          const productIndex = products.indexOf( model.projectProductProperty.value );
          model.projectProductProperty.value = products[ ( productIndex + 1 ) % products.length ];
          renderRight();
        } );
        addProjectButton( 'SUPPORT  ·  ' + model.projectScaffoldingProperty.value + '  ▸', () => {
          const levels = [ 'Guided inquiry', 'Supported inquiry', 'Open inquiry' ];
          const levelIndex = levels.indexOf( model.projectScaffoldingProperty.value );
          model.projectScaffoldingProperty.value = levels[ ( levelIndex + 1 ) % levels.length ];
          model.supportLevelProperty.value = model.projectScaffoldingProperty.value;
          renderRight();
        } );
        addProjectButton( 'HINTS  ·  ' + ( model.hintsEnabledProperty.value ? 'ON' : 'OFF' ), () => {
          model.hintsEnabledProperty.value = !model.hintsEnabledProperty.value;
          renderRight();
        } );
        const criteria = AnimalCellModel.PROJECT_SUCCESS_CRITERIA;
        const criteriaIndex = criteria.indexOf( model.projectSuccessCriteriaProperty.value );
        addProjectButton( 'SUCCESS CRITERIA  ·  ' + model.projectSuccessCriteriaProperty.value + '  ▸', () => {
          model.projectSuccessCriteriaProperty.value = criteria[ ( criteriaIndex + 1 ) % criteria.length ];
          renderRight();
        } );
        addProjectButton( 'START A NEW CASE · CLEARS EVIDENCE', () => {
          const cases = AnimalCellModel.PROJECT_CASES;
          const caseIndex = cases.findIndex( item => item.id === projectCase.id );
          model.startProjectCase( cases[ ( caseIndex + 1 ) % cases.length ].id );
          renderLeft();
          renderRight();
        }, '#FFE8A3' );
      }
      else if ( projectPanelPage === 2 ) {
        const trials = model.trialsProperty.value;
        trials.slice( -3 ).forEach( trial => {
          addProjectText( '#' + trial.number + ' · ' + conciseVariableName( trial.independentVariableKey ) + ' ' + inputDisplayValue( trial.independentVariableKey, trial.value ) +
                          ' · ' + roundSymmetric( trial.before ) + '→' + roundSymmetric( trial.result ) + ' · Health ' + roundSymmetric( trial.cellHealth ) + '%', readableFont( 8 ) );
        } );
        addProjectText( 'Before / after, ATP, protein, waste, and health are saved in the Trials tab. Live graph trends are in Graphs.', readableFont( 8 ) );
      }
      else if ( projectPanelPage === 3 ) {
        addProjectText( model.projectProductProperty.value.toUpperCase() + '  ·  ' + projectCase.title, readableBoldFont( 8 ), '#125F7B' );
        addProjectText( 'Problem: ' + projectCase.symptoms, readableFont( 8 ) );
        addProjectText( 'Diagnosis: ' + model.projectDiagnosisProperty.value, readableFont( 8 ) );
        addProjectText( 'Rescue plan: ' + model.projectRescuePlanProperty.value, readableFont( 8 ) );
        addProjectText( 'CLAIM: ' + model.cerClaimProperty.value, readableFont( 8 ) );
        addProjectText( 'EVIDENCE: ' + model.cerEvidenceProperty.value, readableFont( 8 ) );
        addProjectText( 'REASONING: ' + model.cerReasoningProperty.value, readableFont( 8 ) );
      }
      else if ( projectPanelPage === 4 ) {
        addProjectText( model.projectProductProperty.value.toUpperCase() + '  ·  ' + projectCase.title, readableBoldFont( 8 ), '#125F7B' );
        addProjectText( 'Diagnosis: ' + model.projectDiagnosisProperty.value, readableFont( 8 ) );
        addProjectText( 'CLAIM: ' + model.cerClaimProperty.value, readableFont( 8 ) );
        addProjectText( 'EVIDENCE: ' + model.cerEvidenceProperty.value, readableFont( 8 ) );
        addProjectText( 'REASONING: ' + model.cerReasoningProperty.value, readableFont( 8 ) );
        addProjectText( 'SAVED TRIAL EVIDENCE', readableBoldFont( 8 ), '#125F7B' );
        model.trialsProperty.value.slice( -5 ).forEach( trial => {
          addProjectText( '#' + trial.number + ' · ' + conciseVariableName( trial.independentVariableKey ) + ' ' + inputDisplayValue( trial.independentVariableKey, trial.value ) +
                          ' · ' + roundSymmetric( trial.before ) + '→' + roundSymmetric( trial.result ) +
                          ' · ATP ' + roundSymmetric( trial.atp ) + ' · Protein ' + roundSymmetric( trial.protein ) +
                          ' · Waste ' + roundSymmetric( trial.waste ) + ' · Health ' + roundSymmetric( trial.cellHealth ), readableFont( 8 ) );
        } );
        addProjectText( 'CONCLUSION', readableBoldFont( 8 ), '#125F7B' );
        addProjectText( model.projectConclusionProperty.value, readableFont( 8 ) );
        addProjectText( 'REFLECTION', readableBoldFont( 8 ), '#125F7B' );
        addProjectText( model.projectReflectionProperty.value, readableFont( 8 ) );
        addProjectButton( 'PRINT / SAVE AS PDF', () => window.print(), '#BCEACB' );
      }
      else {
        addProjectText( 'ASSESSMENT RUBRIC · evidence of learning', readableBoldFont( 8 ), '#125F7B' );
        const criteria = [
          [ 'Scientific understanding', milestones[ 1 ] ],
          [ 'Fair experiment design', milestones[ 2 ] && milestones[ 3 ] ],
          [ 'Use of trial data', milestones[ 3 ] && milestones[ 4 ] ],
          [ 'Systems thinking / CER', milestones[ 5 ] ],
          [ 'Evidence-based rescue', milestones[ 6 ] ],
          [ 'Clear final communication', milestones[ 7 ] ],
          [ 'Reflection and revision', milestones[ 8 ] ]
        ];
        criteria.forEach( item => addProjectText( ( item[ 1 ] ? '✓  ' : '○  ' ) + item[ 0 ], readableFont( 8 ), item[ 1 ] ? '#235B3D' : '#526A73' ) );
        addProjectText( 'Rubric evidence is based on investigations and the final product—not a multiple-choice score.', readableFont( 8 ) );
        addProjectButton( 'OPEN NOTEBOOK / CER', () => {
          model.projectPageProperty.value = 'notebook';
          model.modeProperty.value = 'project';
          renderLeft();
        } );
      }
    };
    const renderExplorePanel = () => {
      rightStatusText = null;
      rightStatusBackground = null;
      resultExplanationText = null;
      const x = rightX + 24;
      const width = sideWidth - 58;
      const gap = 20;
      let y = panelTop + 22;
      const addSectionHeading = ( label, size = 19 ) => {
        const heading = new Text( label, {
          font: new PhetFont( { size: size, weight: 'bold' } ), fill: '#125F7B', left: x, top: y,
          maxWidth: width
        } );
        rightContent.addChild( heading );
        y = heading.bottom + 8;
        return heading;
      };
      const addGap = () => { y += gap; };
      const selectedOrganelle = model.selectedOrganelleProperty.value;
      const variableKey = model.selectedVariableProperty.value;
      const definition = definitionForKey( variableKey );
      const flowLabels = [ 'SELECT VARIABLE', 'PREDICT', 'CHANGE VALUE', 'RUN EXPERIMENT', 'WATCH CELL', 'READ RESULT' ];

      addSectionHeading( 'TEST THIS PART', 24 );
      const partName = new Text( ( INFO[ selectedOrganelle ] || INFO.cytoplasm ).name, {
        font: new PhetFont( { size: 18, weight: 'bold' } ), fill: '#294957', left: x, top: y,
        maxWidth: width
      } );
      rightContent.addChild( partName );
      y = partName.bottom + 10;
      const stepText = new Text( 'STEP ' + activeExploreFlowStep + ' OF 6  ·  ' + flowLabels[ activeExploreFlowStep - 1 ], {
        font: new PhetFont( { size: 18, weight: 'bold' } ), fill: '#8B5415', left: x, top: y,
        maxWidth: width
      } );
      rightContent.addChild( stepText );
      y = stepText.bottom;

      addGap();
      addSectionHeading( 'SELECT VARIABLE' );
      const selectionButton = makeButton( definition.label + '  ▼', () => {
        variableMenuOpen = !variableMenuOpen;
        renderRight();
      }, '#E5F3F7', 18, width );
      selectionButton.left = x;
      selectionButton.top = y;
      rightContent.addChild( selectionButton );
      y = selectionButton.bottom + 8;
      if ( variableMenuOpen ) {
        getExperimentVariableKeys().forEach( key => {
          const optionDefinition = definitionForKey( key );
          const option = makeButton( optionDefinition.label, () => selectVariable( key ),
            key === variableKey ? '#9EDFEB' : '#F1F8FA', 18, width );
          option.left = x;
          option.top = y;
          rightContent.addChild( option );
          y = option.bottom + 5;
        } );
        y += 3;
      }

      addGap();
      addSectionHeading( 'CURRENT VALUE' );
      const currentValue = new Text( inputDisplayValue( variableKey, model.variables[ variableKey ].value ), {
        font: new PhetFont( { size: 22, weight: 'bold' } ), fill: '#125F7B', left: x, top: y
      } );
      rightContent.addChild( currentValue );
      const updateCurrentValue = value => { currentValue.string = inputDisplayValue( variableKey, value ); };
      model.variables[ variableKey ].lazyLink( updateCurrentValue );
      rightPanelUnlinks.push( () => model.variables[ variableKey ].unlink( updateCurrentValue ) );
      y = currentValue.bottom + 5;
      if ( variableKey === 'ph' || variableKey === 'water' || variableKey === 'permeability' ) {
        const scaleLabels = variableKey === 'ph' ? [ '6.5  ACIDIC', '7.4  OPTIMAL', '8.5  ALKALINE' ] :
                            variableKey === 'water' ? [ '200  HYPO', '300  NORMAL', '400  HYPER' ] : [ 'LOW', 'NORMAL', 'HIGH' ];
        const scaleRow = new Node();
        scaleLabels.forEach( ( label, index ) => {
          scaleRow.addChild( new Text( label, {
            font: new PhetFont( { size: 16, weight: 'bold' } ), fill: index === 1 ? '#315C48' : '#526A73',
            left: x + index * width / 3, top: y, maxWidth: width / 3 - 2,
            align: index === 0 ? 'left' : index === 1 ? 'center' : 'right'
          } ) );
        } );
        rightContent.addChild( scaleRow );
        y = scaleRow.bottom + 4;
      }
      const slider = new HSlider( model.variables[ variableKey ], new Range( definition.min, definition.max ), {
        trackSize: new Dimension2( width - 10, 9 ), thumbSize: new Dimension2( 24, 34 ),
        majorTickLength: 0, minorTickLength: 0
      } );
      slider.left = x + 5;
      slider.top = y;
      slider.enabled = activeExploreFlowStep >= 3 && activeExploreFlowStep < 5;
      rightContent.addChild( slider );
      y = slider.bottom + 2;
      if ( variableKey === 'ph' ) {
        const healthyLabel = new Text( 'Healthy pH zone: 7.2–7.6', {
          font: new PhetFont( 16 ), fill: '#315C48', left: x, top: y, maxWidth: width
        } );
        rightContent.addChild( healthyLabel );
        y = healthyLabel.bottom;
      }
      const updateExperimentStep = () => {
        if ( activeExploreFlowStep === 3 ) {
          activeExploreFlowStep = 4;
          stepText.string = 'STEP 4 OF 6  ·  ' + flowLabels[ activeExploreFlowStep - 1 ];
          runButton.enabled = true;
        }
      };
      const updateStepFromValue = () => updateExperimentStep();
      model.variables[ variableKey ].lazyLink( updateStepFromValue );
      rightPanelUnlinks.push( () => model.variables[ variableKey ].unlink( updateStepFromValue ) );

      addGap();
      addSectionHeading( 'PREDICT' );
      const predictionButtons = [
        [ 'INCREASE', 'increase' ], [ 'DECREASE', 'decrease' ], [ 'SAME', 'stay the same' ]
      ].map( item => makeButton( item[ 0 ], () => {
        model.predictionProperty.value = item[ 1 ];
        activeExploreFlowStep = 3;
        stepText.string = 'STEP 3 OF 6  ·  ' + flowLabels[ activeExploreFlowStep - 1 ];
        slider.enabled = true;
        renderRight();
      }, model.predictionProperty.value === item[ 1 ] ? '#9EDFEB' : '#EEF7F9', 18, width ) );
      predictionButtons.forEach( button => {
        button.left = x;
        button.top = y;
        rightContent.addChild( button );
        y = button.bottom + 5;
      } );

      addGap();
      addSectionHeading( 'RUN EXPERIMENT' );
      const runButton = makeButton( 'RUN EXPERIMENT', () => {
        if ( !model.trialStartProperty.value ) {
          model.startTrial();
        }
        model.applyCurrentInputs();
        model.triggerFocusEffect( VARIABLE_ORGANELLES[ variableKey ] || variableKey );
        model.pathwayHighlightProperty.value = VARIABLE_PATHWAYS[ variableKey ];
        model.trialLockedProperty.value = true;
        activeExploreFlowStep = 5;
        stepText.string = 'STEP 5 OF 6  ·  ' + flowLabels[ activeExploreFlowStep - 1 ];
        updateCellStateLabels();
        renderRight();
      }, '#BCEACB', 18, width );
      runButton.left = x;
      runButton.top = y;
      runButton.enabled = activeExploreFlowStep === 4 && !!model.predictionProperty.value;
      rightContent.addChild( runButton );
      y = runButton.bottom;

      const inputLabels = {
        ph: 'pH', water: 'Outside osm.', permeability: 'Permeability', energy: 'ATP available',
        mitochondria: 'Mito. function', oxygen: 'Oxygen', glucose: 'Glucose', ribosomes: 'Ribosomes',
        golgi: 'Golgi', lysosomes: 'Lysosome', temperature: 'Temperature'
      };
      const formatInput = ( key, value ) => key === 'ph' ? 'pH ' + formattedNumber( value, 1 ) :
        key === 'water' ? roundSymmetric( value ) + ' mOsm/L' :
        key === 'temperature' ? formattedNumber( value, 1 ) + ' °C' :
        key === 'glucose' ? formattedNumber( value, 1 ) + ' mM' : roundSymmetric( value ) + '%';
      const readingSpecs = key => {
        const selectedInput = { label: inputLabels[ key ], kind: 'input', key: key };
        const output = ( label, outputKey ) => ( { label: label, kind: 'output', key: outputKey } );
        if ( key === 'ph' ) { return [ selectedInput, output( 'ATP', 'atp' ), output( 'Transport', 'transport' ), output( 'Stress', 'stress' ) ]; }
        if ( key === 'water' ) { return [ selectedInput, output( 'Cell volume', 'volume' ), output( 'Water flow', 'waterMovement' ), output( 'Membrane tension', 'membraneTension' ) ]; }
        if ( key === 'permeability' ) { return [ selectedInput, output( 'Transport', 'transport' ), output( 'Internal balance', 'balance' ), output( 'Cell volume', 'volume' ) ]; }
        if ( key === 'energy' ) { return [ output( 'ATP availability', 'atp' ), output( 'Transport speed', 'transport' ), output( 'Protein traffic', 'protein' ), output( 'Cell activity', 'health' ) ]; }
        if ( key === 'mitochondria' || key === 'oxygen' || key === 'glucose' ) { return [ selectedInput, output( 'ATP', 'atp' ), output( 'Transport', 'transport' ), output( 'Cell activity', 'health' ) ]; }
        if ( key === 'ribosomes' ) { return [ selectedInput, output( 'Protein made', 'protein' ), output( 'Protein traffic', 'export' ), output( 'Cell activity', 'health' ) ]; }
        if ( key === 'golgi' ) { return [ selectedInput, output( 'Protein export', 'export' ), output( 'Cargo backlog', 'golgiBacklog' ), output( 'Cell stress', 'stress' ) ]; }
        return [ selectedInput, output( 'Waste load', 'waste' ), output( 'Cell stress', 'stress' ), output( 'Cell activity', 'health' ) ];
      };
      const getOutputValue = key => key === 'phenotype' ? model.phenotypeProperty.value :
        key === 'waterMovement' ? model.waterMovementProperty.value :
        key === 'membraneTension' ? model.membraneTensionProperty.value : model[ key + 'Property' ].value;
      const formatOutput = ( key, value ) => typeof value !== 'number' ? value.toLowerCase().replace( /^./, character => character.toUpperCase() ) :
        ( key === 'waste' || key === 'stress' || key === 'membraneTension' || key === 'golgiBacklog' ? roundSymmetric( value ) + ' index' : roundSymmetric( value ) + '%' );

      addGap();
      addSectionHeading( 'LIVE MEASUREMENTS' );
      const stateColors = {
        HEALTHY: '#E0F3E8', STRESSED: '#FFF0D9', SWOLLEN: '#DDF3FA', SHRUNKEN: '#EAE3F6',
        'LOW-VITALITY': '#E5E8EA', CRITICAL: '#F9DEDC'
      };
      rightStatusBackground = new Rectangle( 0, 0, width, 40, 7, 7, {
        fill: stateColors[ model.phenotypeProperty.value ], stroke: '#AFC8CE', lineWidth: 1,
        left: x, top: y
      } );
      rightStatusText = new Text( model.phenotypeProperty.value.replace( '-', ' ' ), {
        font: new PhetFont( { size: 18, weight: 'bold' } ), fill: '#26734D',
        right: x + width - 10, centerY: rightStatusBackground.centerY, maxWidth: width - 102, align: 'right'
      } );
      const statusLabel = new Text( 'CELL STATE', {
        font: new PhetFont( { size: 18, weight: 'bold' } ), fill: '#294957',
        left: x + 10, centerY: rightStatusBackground.centerY, maxWidth: 96
      } );
      rightContent.addChild( rightStatusBackground );
      rightContent.addChild( statusLabel );
      rightContent.addChild( rightStatusText );
      updateCellStateLabels();
      y = rightStatusBackground.bottom + 8;
      if ( activeExploreFlowStep >= 6 ) {
        readingSpecs( variableKey ).forEach( ( spec, index ) => {
          const row = new Rectangle( 0, 0, width, 36, 5, 5, {
            fill: index % 2 === 0 ? '#F0F7F9' : '#FFFFFF', stroke: '#D8E8EC', lineWidth: 1,
            left: x, top: y
          } );
          const label = new Text( spec.label, {
            font: new PhetFont( 18 ), fill: '#294957', left: x + 8, centerY: row.centerY, maxWidth: 120
          } );
          const currentValueText = new Text( '', {
            font: new PhetFont( { size: 20, weight: 'bold' } ), fill: '#163D50', right: x + width - 8,
            centerY: row.centerY, maxWidth: width - 138, align: 'right'
          } );
          const valueForSpec = () => spec.kind === 'input' ?
            formatInput( spec.key, model.appliedInputsProperty.value[ spec.key ] ) :
            formatOutput( spec.key, getOutputValue( spec.key ) );
          currentValueText.string = valueForSpec();
          const property = spec.kind === 'input' ? model.appliedInputsProperty :
            spec.key === 'waterMovement' ? model.waterMovementProperty :
            spec.key === 'membraneTension' ? model.membraneTensionProperty : model[ spec.key + 'Property' ];
          const updateMeasurement = () => { currentValueText.string = valueForSpec(); };
          property.lazyLink( updateMeasurement );
          rightPanelUnlinks.push( () => property.unlink( updateMeasurement ) );
          rightContent.addChild( row );
          rightContent.addChild( label );
          rightContent.addChild( currentValueText );
          y = row.bottom + 4;
        } );
      }
      else {
        const waitingText = new Text( activeExploreFlowStep === 5 ? 'Cell changing…\nObserve the animation first.' : 'Run the experiment to reveal its readings.', {
          font: new PhetFont( 18 ), fill: '#526A73', left: x, top: y, maxWidth: width
        } );
        rightContent.addChild( waitingText );
        y = waitingText.bottom + 4;
      }

      addGap();
      addSectionHeading( 'BEFORE / AFTER RESULT' );
      if ( activeExploreFlowStep >= 6 ) {
        const beforeInputs = model.trialStartSettingsProperty.value || model.getInputSnapshot();
        const before = model.trialStartProperty.value || model.getOutputSnapshot();
        const afterInputs = model.appliedInputsProperty.value;
        const after = model.getOutputSnapshot();
        const primaryOutput = variableKey === 'ph' ? 'atp' : variableKey === 'water' ? 'volume' :
                              variableKey === 'permeability' ? 'balance' : variableKey === 'energy' ? 'atp' :
                              variableKey === 'golgi' ? 'export' : variableKey === 'lysosomes' ? 'waste' :
                              variableKey === 'ribosomes' ? 'protein' : 'atp';
        const primaryLabel = { atp: 'ATP', volume: 'Volume', balance: 'Balance', export: 'Export', waste: 'Waste', protein: 'Protein' }[ primaryOutput ];
        const inputBefore = formatInput( variableKey, beforeInputs[ variableKey ] );
        const inputAfter = formatInput( variableKey, afterInputs[ variableKey ] );
        const formatPrimary = snapshot => formatOutput( primaryOutput, snapshot[ primaryOutput ] );
        const stateBefore = ( before.phenotype || 'HEALTHY' ).replace( '-', ' ' );
        const stateAfter = model.phenotypeProperty.value.replace( '-', ' ' );
        const columnWidth = ( width - 8 ) / 2;
        const beforeColumn = new Rectangle( 0, 0, columnWidth, 104, 6, 6, {
          fill: '#F0F7F9', stroke: '#D8E8EC', lineWidth: 1, left: x, top: y
        } );
        const afterColumn = new Rectangle( 0, 0, columnWidth, 104, 6, 6, {
          fill: '#F0F7F9', stroke: '#D8E8EC', lineWidth: 1, left: x + columnWidth + 8, top: y
        } );
        rightContent.addChild( beforeColumn );
        rightContent.addChild( afterColumn );
        [
          { rect: beforeColumn, title: 'BEFORE', input: inputBefore, metric: primaryLabel + ' ' + formatPrimary( before ), state: stateBefore },
          { rect: afterColumn, title: 'AFTER', input: inputAfter, metric: primaryLabel + ' ' + formatPrimary( after ), state: stateAfter }
        ].forEach( column => {
          const titleText = new Text( column.title, {
            font: new PhetFont( { size: 18, weight: 'bold' } ), fill: '#125F7B', left: column.rect.left + 8, top: y + 7
          } );
          const detailText = new Text( column.input + '\n' + column.metric + '\n' + column.state, {
            font: new PhetFont( 18 ), fill: '#294957', left: column.rect.left + 8, top: titleText.bottom + 4,
            maxWidth: columnWidth - 16
          } );
          rightContent.addChild( titleText );
          rightContent.addChild( detailText );
        } );
        y = beforeColumn.bottom + 8;
        rightContent.addChild( new Text( 'WHAT CHANGED?', {
          font: new PhetFont( { size: 18, weight: 'bold' } ), fill: '#125F7B', left: x, top: y
        } ) );
        y += 25;
        resultExplanationText = new Text( wrapAtCharacters( getResultExplanation( variableKey ), 28 ), {
          font: new PhetFont( 18 ), fill: '#294957', left: x, top: y, maxWidth: width
        } );
        rightContent.addChild( resultExplanationText );
        y = resultExplanationText.bottom;
      }
      else {
        const beforeAfterText = new Text( activeExploreFlowStep === 5 ? 'Results appear after the cell responds.' : 'Run a trial to compare baseline with outcome.', {
          font: new PhetFont( 18 ), fill: '#526A73', left: x, top: y, maxWidth: width
        } );
        rightContent.addChild( beforeAfterText );
        y = beforeAfterText.bottom;
      }

      addGap();
      addSectionHeading( 'RESET' );
      const resetButton = makeButton( 'RESET TO HEALTHY CELL', () => {
        model.restoreHealthyCellGradually();
        activeExploreFlowStep = 1;
        variableMenuOpen = false;
        resultExplanationText = null;
        rightStatusText = null;
        rightStatusBackground = null;
        model.predictionProperty.value = null;
        model.pathwayHighlightProperty.value = VARIABLE_PATHWAYS[ variableKey ];
        model.startTrial();
        renderRight();
      }, '#DDF3FA', 18, width );
      resetButton.left = x;
      resetButton.top = y;
      rightContent.addChild( resetButton );
      y = resetButton.bottom + 24;

      rightContent.y = 0;
      rightScrollProperty.value = 0;
      rightScrollControls.removeAllChildren();
      if ( rightScrollSlider ) {
        rightScrollSlider.dispose();
        rightScrollSlider = null;
      }
      const maximumScroll = Math.max( 0, y - ( panelTop + panelHeight - 20 ) );
      if ( maximumScroll > 0 ) {
        rightScrollSlider = new VSlider( rightScrollProperty, new Range( 0, maximumScroll ), {
          trackSize: new Dimension2( 7, panelHeight - 44 ), thumbSize: new Dimension2( 18, 36 ),
          majorTickLength: 0, minorTickLength: 0
        } );
        rightScrollSlider.right = rightX + sideWidth - 8;
        rightScrollSlider.top = panelTop + 22;
        rightScrollControls.addChild( rightScrollSlider );
      }
      else {
        rightScrollProperty.value = 0;
      }
    };

    const renderRight = () => {
      rightPanelUnlinks.forEach( unlink => unlink() );
      rightPanelUnlinks = [];
      rightContent.removeAllChildren();
      rightContent.y = 0;
      if ( rightScrollSlider ) {
        rightScrollSlider.dispose();
        rightScrollSlider = null;
      }
      rightScrollControls.removeAllChildren();
      if ( model.modeProperty.value === 'explore' ) {
        renderExplorePanel();
        return;
      }
      if ( model.modeProperty.value === 'learn' ) {
        const data = INFO[ model.selectedOrganelleProperty.value ] || INFO.nucleus;
        const variableKey = data.testVariable;
        const definition = variableKey ? definitionForKey( variableKey ) : null;
        const x = rightX + 14;
        let y = panelTop + 14;
        const heading = new Text( 'TEST THIS PART', {
          font: readableBoldFont( 20 ), fill: '#125F7B', left: x, top: y,
          maxWidth: sideWidth - 28
        } );
        rightContent.addChild( heading );
        y = heading.bottom + 20;
        if ( definition ) {
          const label = new Text( definition.label + '  ·  % of normal function', {
            font: readableBoldFont( 16 ), fill: '#294957', left: x, top: y,
            maxWidth: sideWidth - 28
          } );
          rightContent.addChild( label );
          y = label.bottom + 8;
          const valueText = new Text( roundSymmetric( model.variables[ variableKey ].value ) + '%', {
            font: readableBoldFont( 22 ), fill: '#125F7B', left: x, top: y
          } );
          rightContent.addChild( valueText );
          const updateValue = value => { valueText.string = roundSymmetric( value ) + '%'; };
          model.variables[ variableKey ].lazyLink( updateValue );
          rightPanelUnlinks.push( () => model.variables[ variableKey ].unlink( updateValue ) );
          y = valueText.bottom + 6;
          const slider = new HSlider( model.variables[ variableKey ], new Range( definition.min, definition.max ), {
            trackSize: new Dimension2( sideWidth - 48, 6 ), thumbSize: new Dimension2( 20, 28 ),
            majorTickLength: 0, minorTickLength: 0
          } );
          slider.left = x;
          slider.top = y;
          slider.enabled = !model.trialLockedProperty.value;
          rightContent.addChild( slider );
          y = slider.bottom + 24;
          const runButton = makeButton( model.trialLockedProperty.value ? 'TEST RUNNING…' : 'RUN TEST', () => {
            model.trialStartProperty.value = model.getOutputSnapshot();
            model.trialStartSettingsProperty.value = model.getInputSnapshot();
            model.applyCurrentInputs();
            model.triggerFocusEffect( variableKey );
            model.pathwayHighlightProperty.value = data.pathway;
            model.trialLockedProperty.value = true;
            renderRight();
          }, '#BCEACB', 17, sideWidth - 28 );
          runButton.left = x;
          runButton.top = y;
          runButton.enabled = !model.trialLockedProperty.value;
          rightContent.addChild( runButton );
          y = runButton.bottom + 20;
          const before = model.trialStartProperty.value || model.getOutputSnapshot();
          const addResult = ( titleText, property, key ) => {
            const titleNode = new Text( titleText, {
              font: readableBoldFont( 16 ), fill: '#294957', left: x, top: y
            } );
            const values = new Text( model.trialLockedProperty.value ?
              'Before  ' + roundSymmetric( before[ key ] ) + ( key === 'waste' ? '' : '%' ) + '     Now  ' + roundSymmetric( property.value ) + ( key === 'waste' ? '' : '%' ) :
                                    'Current  ' + roundSymmetric( property.value ) + ( key === 'waste' ? '' : '%' ), {
              font: readableFont( 16 ), fill: '#294957', left: x, top: titleNode.bottom + 3,
              maxWidth: sideWidth - 28
            } );
            const update = value => {
              values.string = model.trialLockedProperty.value ?
                              'Before  ' + roundSymmetric( before[ key ] ) + ( key === 'waste' ? '' : '%' ) + '     Now  ' + roundSymmetric( value ) + ( key === 'waste' ? '' : '%' ) :
                              'Current  ' + roundSymmetric( value ) + ( key === 'waste' ? '' : '%' );
            };
            property.lazyLink( update );
            rightPanelUnlinks.push( () => property.unlink( update ) );
            rightContent.addChild( titleNode );
            rightContent.addChild( values );
            y = values.bottom + 12;
          };
          addResult( 'ATP availability', model.atpProperty, 'atp' );
          addResult( 'Protein production', model.proteinProperty, 'protein' );
          addResult( 'Waste burden', model.wasteProperty, 'waste' );
          addResult( 'Cell health', model.healthProperty, 'health' );
          if ( model.trialLockedProperty.value ) {
            rightContent.addChild( new Text( model.responseReadyProperty.value ? 'Cell response measured' : 'Cell response unfolding…', {
              font: readableBoldFont( 15 ), fill: '#315C48', left: x, top: y + 3,
              maxWidth: sideWidth - 28
            } ) );
          }
          const resetButton = makeButton( 'RESET TO HEALTHY CELL', () => {
            model.restoreHealthyCellGradually();
            model.pathwayHighlightProperty.value = data.pathway || null;
            renderRight();
          }, '#DDF3FA', 16, sideWidth - 28 );
          resetButton.left = x;
          resetButton.bottom = panelTop + panelHeight - 12;
          rightContent.addChild( resetButton );
        }
        else {
          rightContent.addChild( new Text( 'This structure is shown for context. Its function is not independently adjusted in this simplified model.', {
            font: readableFont( 16 ), fill: '#294957', left: x, top: y + 12,
            maxWidth: sideWidth - 28
          } ) );
          rightContent.addChild( new Text( 'Select a functional organelle to test its effect on the cell.', {
            font: readableFont( 16 ), fill: '#486C7A', left: x, top: y + 110,
            maxWidth: sideWidth - 28
          } ) );
          const resetButton = makeButton( 'RESET TO HEALTHY CELL', () => {
            model.restoreHealthyCellGradually();
            model.pathwayHighlightProperty.value = data.pathway || null;
            renderRight();
          }, '#DDF3FA', 16, sideWidth - 28 );
          resetButton.left = x;
          resetButton.bottom = panelTop + panelHeight - 12;
          rightContent.addChild( resetButton );
        }
        return;
      }
      const tabs = ( model.projectActiveProperty.value ?
                    [ [ 'Data', 'data' ], [ 'Graphs', 'graphs' ], [ 'Trials', 'notebook' ], [ 'Project', 'project' ] ] :
                    [ [ 'Data', 'data' ], [ 'Graphs', 'graphs' ], [ 'Trials', 'notebook' ], [ 'Teacher', 'teacher' ] ] ).map( item => makeButton( item[ 0 ], () => {
        model.rightPanelProperty.value = item[ 1 ];
        renderRight();
      }, model.rightPanelProperty.value === item[ 1 ] ? '#9EE2F0' : '#EAF5F8', 9 ) );
      const tabRow = new HBox( { children: tabs, spacing: 2, left: rightX + 8, top: panelTop + 7 } );
      rightContent.addChild( tabRow );
      const panelMode = model.rightPanelProperty.value;

      if ( panelMode === 'project' && model.projectActiveProperty.value ) {
        renderProjectPanel( rightContent, tabRow );
      }
      else if ( panelMode === 'data' ) {
        rightContent.addChild( new Text( 'MEASUREMENTS', {
          font: readableBoldFont( 17 ), fill: '#125F7B',
          left: rightX + 13, top: tabRow.bottom + 8
        } ) );
        const selectedKey = model.selectedVariableProperty.value;
        const variable = definitionForKey( selectedKey ) || AnimalCellModel.VARIABLE_DEFINITIONS[ 0 ];
        const directMetric = METRICS.find( item => item[ 1 ] === variable.outputKey ) || METRICS[ 0 ];
        const rows = [
          { label: variable.label, property: model.variables[ selectedKey ], value: current => inputDisplayValue( selectedKey, current ), color: '#13728B' },
          { label: directMetric[ 0 ], property: metricProperty( model, directMetric[ 1 ] ), value: current => directMetric[ 1 ] === 'waste' ? roundSymmetric( current ) + ' · relative index' : roundSymmetric( current ) + '% · model estimate', color: directMetric[ 2 ] },
          { label: 'Cell status', property: model.cellStatusProperty, value: current => current, color: '#315C48' }
        ];
        rows.forEach( ( row, index ) => {
          const y = tabRow.bottom + 43 + index * 108;
          rightContent.addChild( new Text( row.label, {
            font: readableBoldFont( 11 ), fill: '#294957', left: rightX + 13, top: y,
            maxWidth: sideWidth - 26
          } ) );
          const reading = new Text( '', {
            font: readableBoldFont( 19 ), fill: row.color, left: rightX + 13, top: y + 30,
            maxWidth: sideWidth - 26
          } );
          const updateReading = current => { reading.string = row.value( current ); };
          updateReading( row.property.value );
          linkPanelProperty( row.property, updateReading );
          rightContent.addChild( reading );
          if ( index < 2 ) {
            rightContent.addChild( new Rectangle( 0, 0, sideWidth - 28, 1, {
              fill: '#D8E5E9', left: rightX + 13, top: y + 83
            } ) );
          }
        } );
        rightContent.addChild( new Text( 'ATP, protein, transport, and waste are model estimates relative to a healthy baseline—not lab measurements.', {
          font: readableFont( 8 ), fill: '#526A73', maxWidth: sideWidth - 26,
          left: rightX + 13, bottom: panelTop + panelHeight - 56
        } ) );
        const healthyButton = makeButton( 'RESET TO HEALTHY CELL', () => {
          model.restoreHealthyCellGradually();
          exploreStep = 1;
          trialPanelPage = 'design';
          renderLeft();
          renderRight();
        }, '#DCEEF2', 10 );
        healthyButton.left = rightX + 13;
        healthyButton.bottom = panelTop + panelHeight - 7;
        rightContent.addChild( healthyButton );
      }
      else if ( panelMode === 'graphs' ) {
        addPanelTitle( rightContent, 'Trial relationship', rightX, tabRow.bottom + 1 );
        const savedTrials = model.trialsProperty.value.slice( -5 );
        if ( !savedTrials.length ) {
          rightContent.addChild( new Text( 'Run and save trials to plot the tested input against its measured model response.', {
            font: readableFont( 10 ), fill: '#294957', left: rightX + 14, top: tabRow.bottom + 56,
            maxWidth: sideWidth - 28
          } ) );
        }
        else {
          const latestKey = savedTrials[ savedTrials.length - 1 ].independentVariableKey;
          const graphTrials = savedTrials.filter( trial => trial.independentVariableKey === latestKey );
          const definition = definitionForKey( latestKey );
          const outputKey = graphTrials[ graphTrials.length - 1 ].dependentVariable;
          const outputMetric = METRICS.find( item => item[ 1 ] === outputKey );
          const outputName = outputMetric ? outputMetric[ 0 ] : 'Model output';
          const outputUnit = outputKey === 'waste' ? 'Relative waste index (0–100)' : outputKey === 'volume' ? '% of baseline cell volume' : '% of healthy baseline';
          rightContent.addChild( new Text( outputName + ' vs ' + definition.label, {
            font: readableBoldFont( 10 ), fill: '#294957', left: rightX + 14, top: tabRow.bottom + 53,
            maxWidth: sideWidth - 28
          } ) );
          const graphLeft = rightX + 66;
          const graphTop = tabRow.bottom + 112;
          const graphWidth = sideWidth - 86;
          const graphHeight = 235;
          const graphBottom = graphTop + graphHeight;
          const yMax = outputKey === 'volume' ? 160 : 100;
          const xMin = definition.min === undefined ? 0 : definition.min;
          const xMax = definition.max === undefined ? 100 : definition.max;
          const xSpan = xMax - xMin || 1;
          const yTickValues = [ 0, yMax / 2, yMax ];
          yTickValues.forEach( tick => {
            const y = graphBottom - tick / yMax * graphHeight;
            rightContent.addChild( new Path( Shape.lineSegment( new Vector2( graphLeft, y ), new Vector2( graphLeft + graphWidth, y ) ), {
              stroke: tick === 0 ? '#667D86' : '#D9E4E8', lineWidth: tick === 0 ? 2 : 1
            } ) );
            rightContent.addChild( new Text( String( tick ), {
              font: readableFont( 8 ), fill: '#536A73', right: graphLeft - 8, centerY: y
            } ) );
          } );
          rightContent.addChild( new Path( Shape.lineSegment( new Vector2( graphLeft, graphTop ), new Vector2( graphLeft, graphBottom ) ), {
            stroke: '#667D86', lineWidth: 2
          } ) );
          [ xMin, ( xMin + xMax ) / 2, xMax ].forEach( tick => {
            const x = graphLeft + ( tick - xMin ) / xSpan * graphWidth;
            rightContent.addChild( new Path( Shape.lineSegment( new Vector2( x, graphBottom ), new Vector2( x, graphBottom + 7 ) ), {
              stroke: '#667D86', lineWidth: 1.5
            } ) );
            rightContent.addChild( new Text( formattedNumber( tick, latestKey === 'ph' || latestKey === 'temperature' || latestKey === 'glucose' ? 1 : 0 ), {
              font: readableFont( 8 ), fill: '#536A73', centerX: x, top: graphBottom + 10
            } ) );
          } );
          rightContent.addChild( new Text( outputUnit, {
            font: readableFont( 8 ), fill: '#294957', left: rightX + 13, top: graphTop - 29,
            maxWidth: sideWidth - 26
          } ) );
          rightContent.addChild( new Text( definition.label + ( definition.unit ? ' (' + definition.unit + ')' : '' ), {
            font: readableBoldFont( 8 ), fill: '#294957', centerX: graphLeft + graphWidth / 2, top: graphBottom + 40,
            maxWidth: graphWidth
          } ) );
          graphTrials.forEach( trial => {
            const x = graphLeft + ( trial.value - xMin ) / xSpan * graphWidth;
            const y = graphBottom - Math.max( 0, Math.min( yMax, trial.result ) ) / yMax * graphHeight;
            const point = new Circle( 7, { fill: '#13728B', stroke: '#FFFFFF', lineWidth: 2, centerX: x, centerY: y } );
            rightContent.addChild( point );
            rightContent.addChild( new Text( 'T' + trial.number, {
              font: readableBoldFont( 8 ), fill: '#173A4A', left: x + 8, centerY: y,
              maxWidth: 44
            } ) );
          } );
          rightContent.addChild( new Text( graphTrials.length + ' trial' + ( graphTrials.length === 1 ? '' : 's' ) + ' · one plotted point per saved run.', {
            font: readableFont( 8 ), fill: '#526A73', left: rightX + 13, top: graphBottom + 72,
            maxWidth: sideWidth - 26
          } ) );
        }
      }
      else if ( panelMode === 'organelle' ) {
        const data = INFO[ model.selectedOrganelleProperty.value ];
        rightContent.addChild( new Text( 'ORGANELLE DETAILS', {
          font: readableBoldFont( 18 ), fill: '#125F7B', left: rightX + 13, top: tabRow.bottom + 13,
          maxWidth: sideWidth - 26
        } ) );
        const organelleName = new Text( data.name.toUpperCase(), {
          font: readableBoldFont( 18 ), fill: '#173A4A', left: rightX + 13, top: tabRow.bottom + 43,
          maxWidth: sideWidth - 26
        } );
        rightContent.addChild( organelleName );
        let y = organelleName.bottom + 12;
        [ [ 'Function', data.job ], [ 'Works with', data.connects ], [ 'If function decreases', data.failure ] ].forEach( item => {
          const label = new Text( item[ 0 ], {
            font: readableBoldFont( 9 ), fill: '#125F7B', left: rightX + 13, top: y
          } );
          const description = new Text( item[ 1 ], {
            font: readableFont( 10 ), fill: '#294957', maxWidth: sideWidth - 26,
            left: rightX + 13, top: label.bottom + 2
          } );
          rightContent.addChild( label );
          rightContent.addChild( description );
          y = description.bottom + 10;
        } );
        const highlightButton = makeButton( 'Highlight pathway', () => {
          model.pathwayHighlightProperty.value = data.pathway;
        }, '#FFE3A5', 10 );
        highlightButton.left = rightX + 13;
        highlightButton.top = y + 2;
        rightContent.addChild( highlightButton );
        const testButton = makeButton( 'Test this organelle', () => {
          model.resetToHealthyCell();
          model.selectedVariableProperty.value = data.testVariable;
          model.advancedExploreProperty.value = false;
          advancedTrialSaved = false;
          exploreStep = 1;
          model.experimentPanelProperty.value = 'controls';
          model.modeProperty.value = 'explore';
          model.startTrial();
          model.rightPanelProperty.value = 'data';
          trialPanelPage = 'design';
          renderLeft();
          renderRight();
        }, '#BCEACB', 10 );
        testButton.left = rightX + 13;
        testButton.top = highlightButton.bottom + 6;
        rightContent.addChild( testButton );
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
        }
        else {
        const recentTrials = model.trialsProperty.value.slice( -5 );
        const selectedTrials = model.selectedTrialsProperty.value.map( number => model.trialsProperty.value.find( trial => trial.number === number ) ).filter( Boolean );
        const evidencePrompt = selectedTrials.length === 2 ?
                               'Evidence prompt · Compare trials ' + selectedTrials[ 0 ].number + ' and ' + selectedTrials[ 1 ].number + ': what changed with the input?' :
                               'Select two saved runs to compare. Graphs plots the recent trials.';
        const note = new Text( evidencePrompt, {
          font: readableFont( 9 ), fill: '#294957', maxWidth: sideWidth - 26,
          left: rightX + 13, top: tabRow.bottom + 34
        } );
        rightContent.addChild( note );
        let y = note.bottom + 9;
        const tableHeader = new Text( 'TRIALS  ·  TAP TO SELECT', {
          font: readableBoldFont( 10 ), fill: '#125F7B', left: rightX + 13, top: y,
          maxWidth: sideWidth - 26
        } );
        rightContent.addChild( tableHeader );
        y = tableHeader.bottom + 4;
        const visibleTrials = recentTrials;
        visibleTrials.forEach( trial => {
          const selected = model.selectedTrialsProperty.value.includes( trial.number );
          const beforeSettings = trial.beforeSettings || {};
          const beforeOutputs = trial.beforeOutputs || {};
          const inputBefore = beforeSettings[ trial.independentVariableKey ];
          const inputSummary = inputBefore === undefined || inputBefore === trial.value ? inputDisplayValue( trial.independentVariableKey, trial.value ) :
                               inputDisplayValue( trial.independentVariableKey, inputBefore ) + ' → ' + inputDisplayValue( trial.independentVariableKey, trial.value );
          const outputName = { atp: 'ATP', protein: 'Protein', waste: 'Waste', volume: 'Volume', health: 'Health', export: 'Export', balance: 'Balance', transport: 'Transport' }[ trial.dependentVariable ] || 'Output';
          const beforeResult = trial.before === undefined ? beforeOutputs[ trial.dependentVariable ] : trial.before;
          const afterResult = trial.result === undefined ? trial[ trial.dependentVariable ] : trial.result;
          const outputUnit = trial.dependentVariable === 'waste' ? 'relative index' : '% of baseline';
          const beforeStatus = beforeOutputs.status || 'Stable';
          const row = new Text( ( selected ? '☑ ' : '□ ' ) + 'TRIAL ' + trial.number + ' · ' + conciseVariableName( trial.independentVariableKey ) +
                               '\nInput: ' + inputSummary + '   ·   ' + outputName + ': ' + roundSymmetric( beforeResult ) + ' → ' + roundSymmetric( afterResult ) + ' ' + outputUnit +
                               '\nCell status: ' + beforeStatus + ' → ' + ( trial.cellStatus || '—' ) + '   ·   ' + trial.observation, {
            font: readableFont( 8 ), fill: selected ? '#125F7B' : '#294957', maxWidth: sideWidth - 30,
            left: rightX + 13, top: y, cursor: 'pointer'
          } );
          const toggleTrial = () => {
            const selectedNumbers = model.selectedTrialsProperty.value;
            model.selectedTrialsProperty.value = selected ? selectedNumbers.filter( number => number !== trial.number ) : [ ...selectedNumbers, trial.number ].slice( -2 );
          };
          const card = new Rectangle( 0, 0, sideWidth - 26, row.height + 12, 6, 6, {
            fill: selected ? '#E1F4F8' : '#F5FAFC', stroke: '#D1E6EC', lineWidth: 1,
            left: rightX + 10, top: y - 5, cursor: 'pointer'
          } );
          card.addInputListener( new FireListener( { fire: toggleTrial } ) );
          row.addInputListener( new FireListener( { fire: toggleTrial } ) );
          rightContent.addChild( card );
          rightContent.addChild( row );
          y = row.bottom + 8;
        } );
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

    const updateOrganelleOutlines = () => {
      const energySupport = 0.34 + 0.0066 * model.atpProperty.value;
      const phenotype = model.phenotypeProperty.value;
      const vitalityFactor = phenotype === 'LOW-VITALITY' ? 0.68 : phenotype === 'CRITICAL' ? 0.54 : phenotype === 'STRESSED' ? 0.84 : 1;
      Object.keys( organelleShapes ).forEach( orgKey => {
        const focused = model.focusEffectKeyProperty.value === orgKey;
        const selected = model.selectedOrganelleProperty.value === orgKey;
        organelleNodes[ orgKey ].opacity = ( organelleActivity[ orgKey ] === undefined ? 1 : organelleActivity[ orgKey ] ) * energySupport * vitalityFactor * ( selected ? 1 : 0.72 );
        organelleLabels[ orgKey ].visible = selected;
        organelleShapes[ orgKey ].forEach( shape => {
          shape.lineWidth = focused ? 4 : selected ? 3 : 1.5;
          shape.stroke = focused ? '#E28C00' : selected ? '#102D3A' : '#34505C';
        } );
      } );
      const membraneFocused = model.focusEffectKeyProperty.value === 'membrane';
      const tense = model.membraneTensionProperty.value;
      const selectedOrganelle = model.selectedOrganelleProperty.value;
      cellRoot.opacity = vitalityFactor;
      cytoplasmLabel.visible = selectedOrganelle === 'cytoplasm';
      membraneLabel.visible = selectedOrganelle === 'membrane';
      membrane.opacity = model.selectedOrganelleProperty.value === 'membrane' ? 1 : 0.62;
      cytoplasm.opacity = model.selectedOrganelleProperty.value === 'cytoplasm' ? 0.92 : 0.64;
      cytoplasmGlow.opacity = model.selectedOrganelleProperty.value === 'cytoplasm' ? 0.28 : 0.04;
      membrane.lineWidth = membraneFocused ? 15 : 7 + tense * 0.045;
      membrane.fill = phenotype === 'CRITICAL' ? '#E8887C' : phenotype === 'LOW-VITALITY' ? '#A7B5BC' :
                      phenotype === 'STRESSED' ? '#D9B2A5' : phenotype === 'SWOLLEN' ? '#F2C782' :
                      phenotype === 'SHRUNKEN' ? '#C5B8E0' : '#A6EAF7';
      cytoplasm.fill = phenotype === 'CRITICAL' ? '#E9B0A6' : phenotype === 'LOW-VITALITY' ? '#BCC6C9' :
                       phenotype === 'STRESSED' ? '#CFDCDD' : phenotype === 'SWOLLEN' ? '#D4F1FA' :
                       phenotype === 'SHRUNKEN' ? '#E0DAF0' : '#E9FBFF';
      membrane.stroke = membraneFocused ? '#E28C00' : phenotype === 'CRITICAL' ? '#C63B46' :
                        phenotype === 'SWOLLEN' ? '#E48730' : phenotype === 'SHRUNKEN' ? '#8065A7' :
                        mixColor( '#54BFD7', '#CF5C4C', Math.max( model.stressProperty.value, tense * 0.55 ) / 100 );
      membraneWrinkles.forEach( wrinkle => {
        wrinkle.opacity = model.phenotypeProperty.value === 'SHRUNKEN' ? 0.85 :
                          tense > 42 || model.appliedInputsProperty.value.permeability > 160 ? 0.55 : 0;
      } );
    };
    const updatePathwayHighlight = selectedPathway => {
      Object.keys( pathwayOverlays ).forEach( pathway => {
        pathwayOverlays[ pathway ].opacity = selectedPathway === pathway ? 0.8 : 0;
      } );
    };
    model.projectPageProperty.link( () => renderLeft() );
    model.projectNotebookPageProperty.link( () => renderLeft() );
    model.projectRoleRotationProperty.link( () => {
      if ( model.modeProperty.value === 'project' ) {
        renderLeft();
      }
      if ( model.rightPanelProperty.value === 'project' ) {
        renderRight();
      }
    } );
    model.selectedOrganelleProperty.link( () => {
      updateOrganelleOutlines();
      renderLeft();
      renderRight();
    } );
    model.focusEffectKeyProperty.link( updateOrganelleOutlines );
    model.pathwayHighlightProperty.link( updatePathwayHighlight );
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
    model.trialsProperty.link( () => {
      renderRight();
      if ( model.projectActiveProperty.value ) {
        renderLeft();
      }
    } );
    model.selectedTrialsProperty.link( () => {
      model.compareProjectTrials();
      if ( model.projectActiveProperty.value ) {
        renderLeft();
      }
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
    model.responseReadyProperty.lazyLink( ready => {
      if ( ready && ( model.modeProperty.value === 'explore' || model.modeProperty.value === 'whatif' ) ) {
        if ( model.modeProperty.value === 'explore' && activeExploreFlowStep === 5 ) {
          activeExploreFlowStep = 6;
        }
        renderLeft();
        renderRight();
      }
    } );

    // Visual properties respond to model outputs; size is illustrative, not to scale.
    model.volumeProperty.link( volume => {
      const scaleFactor = 0.76 + volume * 0.0024;
      membrane.scaleX = scaleFactor;
      membrane.scaleY = scaleFactor * 0.82;
      cytoplasm.scaleX = scaleFactor * 0.9;
      cytoplasm.scaleY = scaleFactor * 0.74;
      cytoplasmGlow.scaleX = scaleFactor * 0.88;
      cytoplasmGlow.scaleY = scaleFactor * 0.72;
      const organelleSpread = 0.78 + volume * 0.0022;
      Object.keys( organelleNodes ).forEach( key => {
        const position = INFO[ key ].position;
        organelleNodes[ key ].x = position[ 0 ] * organelleSpread;
        organelleNodes[ key ].y = position[ 1 ] * organelleSpread;
      } );
    } );
    model.healthProperty.link( health => {
      cytoplasm.fill = mixColor( '#E9FBFF', '#A8BAC8', ( 100 - health ) / 95 );
      membrane.fill = mixColor( '#A6EAF7', '#E9B4A8', ( 100 - health ) / 100 );
      updateOrganelleOutlines();
    } );
    model.stressProperty.link( () => updateOrganelleOutlines() );
    model.membraneTensionProperty.link( () => updateOrganelleOutlines() );
    model.phenotypeProperty.link( () => updateOrganelleOutlines() );
    const organelleFunctions = {
      mitochondria: 'mitochondria', ribosomes: 'ribosomes', roughER: 'roughER',
      golgi: 'golgi', lysosome: 'lysosomes', nucleolus: 'nucleusSignal', nucleus: 'nucleusSignal',
      smoothER: 'ph'
    };
    const updateOrganelleActivity = inputs => {
      Object.entries( organelleFunctions ).forEach( entry => {
        const current = entry[ 1 ] === 'ph' ? Math.max( 0, 100 - Math.max( 0, Math.abs( inputs.ph - 7.4 ) - 0.2 ) * 80 ) : inputs[ entry[ 1 ] ];
        organelleActivity[ entry[ 0 ] ] = 0.28 + 0.72 * current / 100;
      } );
      updateOrganelleOutlines();
    };
    updateOrganelleActivity( model.appliedInputsProperty.value );
    model.appliedInputsProperty.link( updateOrganelleActivity );
    model.atpProperty.link( atp => {
      updateOrganelleOutlines();
      organelleNodes.mitochondria.scale = 0.88 + atp / 400;
      mitochondriaGlowNode.opacity = Math.min( 0.95, 0.12 + atp * 0.008 + model.appliedInputsProperty.value.mitochondria * 0.002 );
      energyParticles.forEach( ( particle, index ) => {
        particle.opacity = Math.max( 0.08, Math.min( 1, atp / 100 - index * 0.055 ) );
        particle.visible = model.pathwayHighlightProperty.value === 'energy' && atp > index * 12 + 8;
      } );
    } );
    model.proteinProperty.link( protein => {
      organelleNodes.ribosomes.scale = 0.86 + protein / 360;
      proteinParticles.forEach( ( particle, index ) => {
        particle.opacity = Math.max( 0.08, Math.min( 1, protein / 100 - index * 0.09 ) );
        particle.visible = model.pathwayHighlightProperty.value === 'protein' && protein > index * 14 + 8;
      } );
    } );
    model.wasteProperty.link( waste => {
      wasteParticles.forEach( particle => { particle.opacity = Math.max( 0.12, Math.min( 1, waste / 80 ) ); } );
      wasteBuildup.forEach( ( particle, index ) => {
        particle.opacity = Math.max( 0.02, Math.min( 0.92, ( waste - index * 8 ) / 58 ) );
      } );
    } );
    model.transportProperty.link( transport => {
      organelleNodes.vesicles.opacity = Math.min( 1, 0.25 + transport / 130 );
      membraneParticles.forEach( ( particle, index ) => {
        particle.opacity = Math.max( 0.08, Math.min( 1, transport / 100 - index * 0.09 ) );
        particle.visible = model.pathwayHighlightProperty.value === 'transport' && transport > 0.5;
      } );
    } );
    model.golgiBacklogProperty.link( backlog => {
      golgiBacklogParticles.forEach( ( particle, index ) => {
        particle.opacity = Math.max( 0.02, Math.min( 1, ( backlog + 12 - index * 8 ) / 55 ) );
      } );
    } );
    model.flowPhaseProperty.link( phase => {
      energyParticles.forEach( ( particle, index ) => {
        const energyTargets = [ [ -150, 28 ], [ 50, 24 ], [ 149, 66 ] ];
        const t = ( phase + index / energyParticles.length ) % 1;
        const target = energyTargets[ index % energyTargets.length ];
        particle.centerX = -132 + ( target[ 0 ] + 132 ) * t;
        particle.centerY = -70 + ( target[ 1 ] + 70 ) * t;
      } );
      organelleNodes.mitochondria.scale = 0.88 + model.atpProperty.value / 400 + Math.sin( phase * Math.PI * 2 ) * model.appliedInputsProperty.value.mitochondria / 1800;
    } );
    model.proteinFlowPhaseProperty.link( phase => {
      const proteinPath = [ [ -22, -12 ], [ -150, 28 ], [ -87, 89 ], [ 97, -63 ], [ 149, 66 ], [ 185, 4 ] ];
      proteinParticles.forEach( ( particle, index ) => {
        let t = ( phase + index / proteinParticles.length ) % 1;
        if ( model.appliedInputsProperty.value.golgi < 95 && t > 0.47 ) {
          t = 0.47;
        }
        const pathPosition = t * ( proteinPath.length - 1 );
        const segment = Math.min( proteinPath.length - 2, Math.floor( pathPosition ) );
        const segmentProgress = pathPosition - segment;
        particle.centerX = proteinPath[ segment ][ 0 ] + ( proteinPath[ segment + 1 ][ 0 ] - proteinPath[ segment ][ 0 ] ) * segmentProgress;
        particle.centerY = proteinPath[ segment ][ 1 ] + ( proteinPath[ segment + 1 ][ 1 ] - proteinPath[ segment ][ 1 ] ) * segmentProgress;
      } );
    } );
    model.wasteFlowPhaseProperty.link( phase => {
      wasteParticles.forEach( ( particle, index ) => {
        const t = ( phase + index / wasteParticles.length ) % 1;
        particle.centerX = 138 - t * 52;
        particle.centerY = 75 + t * 28;
      } );
    } );
    model.transportFlowPhaseProperty.link( phase => {
      const inputs = model.appliedInputsProperty.value;
      const waterIsSelected = model.selectedVariableProperty.value === 'water';
      membraneParticles.forEach( ( particle, index ) => {
        const t = ( phase + index / membraneParticles.length ) % 1;
        particle.centerX = -174 + t * 348;
        particle.centerY = 4 + Math.sin( t * Math.PI * 2 ) * 72;
        particle.opacity = Math.max( 0.08, Math.min( 1, model.transportProperty.value / 100 - index * 0.09 ) );
        particle.visible = model.pathwayHighlightProperty.value === 'transport' && !waterIsSelected && model.transportProperty.value > 0.5;
      } );
      const osmoticDifference = inputs.water - 300;
      waterParticles.forEach( ( particle, index ) => {
        const t = ( phase + index / waterParticles.length ) % 1;
        const inside = osmoticDifference < -8 ? index < 6 : osmoticDifference > 8 ? index >= 6 : index % 2 === 0;
        const entering = osmoticDifference < -8 ? inside : osmoticDifference > 8 ? !inside : inside;
        particle.centerX = entering ? -218 + t * 62 : -156 - t * 62;
        particle.centerY = -63 + index * 18;
        particle.opacity = Math.max( 0.18, Math.min( 1, inputs.permeability / 110 ) );
        particle.visible = model.pathwayHighlightProperty.value === 'transport' && waterIsSelected;
      } );
    } );

    this.addChild( new Text( 'Simplified model: values show relationships, not measured values from a real cell.', {
      font: readableFont( 12 ), fill: '#536A73', centerX: this.layoutBounds.centerX,
      bottom: this.layoutBounds.maxY - 5, maxWidth: viewWidth - 80
    } ) );

    this.addChild( new ResetAllButton( {
      listener: () => {
        model.reset();
        model.pathwayHighlightProperty.value = INFO[ model.selectedOrganelleProperty.value ].pathway;
        model.startTrial();
        renderLeft();
        renderRight();
      }, right: this.layoutBounds.maxX - 13,
      bottom: this.layoutBounds.maxY - 12
    } ) );

    model.pathwayHighlightProperty.value = INFO[ model.selectedOrganelleProperty.value ].pathway;
    model.startTrial();
    renderLeft();
    renderRight();
  }

}

export default AnimalCellScreenView;
