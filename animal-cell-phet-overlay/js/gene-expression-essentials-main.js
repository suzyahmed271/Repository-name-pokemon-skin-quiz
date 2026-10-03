// Copyright 2016-2026, University of Colorado Boulder

/**
 * Main entry point for the adapted Animal Cell Systems Lab.
 *
 * @author Suzan Ahmed Mustafa
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import GeneExpressionEssentialsStrings from './GeneExpressionEssentialsStrings.js';
import AnimalCellScreen from './animal-cell/AnimalCellScreen.js';

const titleProperty = GeneExpressionEssentialsStrings[ 'gene-expression-essentials' ].titleStringProperty;

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
