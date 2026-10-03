// Copyright 2016-2026, University of Colorado Boulder

/**
 * Main entry point for the adapted Animal Cell Systems Lab.
 *
 * @author Suzan Ahmed Mustafa
 */

import StringProperty from '../../axon/js/StringProperty.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import AnimalCellScreen from './animal-cell/AnimalCellScreen.js';

const titleProperty = new StringProperty( 'Animal Cell Systems Lab' );

const simOptions = {
  credits: {
    leadDesign: 'Suzan Ahmed Mustafa',
    softwareDevelopment: 'Adapted classroom project',
    team: 'Grade 6 Science',
    qualityAssurance: 'Classroom prototype'
  }
};

simLauncher.launch( () => {
  const sim = new Sim(
    titleProperty,
    [ new AnimalCellScreen() ],
    simOptions
  );
  sim.start();
} );
