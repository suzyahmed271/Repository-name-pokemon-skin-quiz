// Copyright 2015-2026, University of Colorado Boulder

/**
 * Model for the Animal Cell Systems Lab adapted classroom simulation.
 *
 * @author Suzan Ahmed Mustafa
 */

/* eslint-env es6 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';

class AnimalCellModel {
  constructor() {
    this.modeProperty = new Property( 'learn' );
    this.selectedOrganelleProperty = new Property( 'nucleus' );

    this.energyProperty = new NumberProperty( 82 );
    this.proteinProperty = new NumberProperty( 82 );
    this.wasteControlProperty = new NumberProperty( 86 );
    this.balanceProperty = new NumberProperty( 92 );

    this.nucleusWorkingProperty = new BooleanProperty( true );
    this.ribosomesWorkingProperty = new BooleanProperty( true );
    this.golgiWorkingProperty = new BooleanProperty( true );
    this.lysosomeWorkingProperty = new BooleanProperty( true );
    this.membraneStableProperty = new BooleanProperty( true );
    this.highEnergyDemandProperty = new BooleanProperty( false );
  }

  /**
   * Restore normal healthy-cell values.
   * @public
   */
  resetCell() {
    this.energyProperty.value = 82;
    this.proteinProperty.value = 82;
    this.wasteControlProperty.value = 86;
    this.balanceProperty.value = 92;
    this.nucleusWorkingProperty.value = true;
    this.ribosomesWorkingProperty.value = true;
    this.golgiWorkingProperty.value = true;
    this.lysosomeWorkingProperty.value = true;
    this.membraneStableProperty.value = true;
    this.highEnergyDemandProperty.value = false;
  }

  /**
   * Run a cause-and-effect experiment.
   * @param {string} experiment
   * @public
   */
  runExperiment( experiment ) {
    this.resetCell();

    if ( experiment === 'energy' ) {
      this.highEnergyDemandProperty.value = true;
      this.energyProperty.value = 97;
      this.proteinProperty.value = 90;
      this.balanceProperty.value = 90;
    }
    else if ( experiment === 'nucleus' ) {
      this.nucleusWorkingProperty.value = false;
      this.energyProperty.value = 70;
      this.proteinProperty.value = 22;
      this.wasteControlProperty.value = 62;
      this.balanceProperty.value = 43;
    }
    else if ( experiment === 'ribosomes' ) {
      this.ribosomesWorkingProperty.value = false;
      this.energyProperty.value = 76;
      this.proteinProperty.value = 8;
      this.wasteControlProperty.value = 70;
      this.balanceProperty.value = 50;
    }
    else if ( experiment === 'golgi' ) {
      this.golgiWorkingProperty.value = false;
      this.energyProperty.value = 78;
      this.proteinProperty.value = 64;
      this.wasteControlProperty.value = 69;
      this.balanceProperty.value = 58;
    }
    else if ( experiment === 'lysosome' ) {
      this.lysosomeWorkingProperty.value = false;
      this.energyProperty.value = 70;
      this.proteinProperty.value = 73;
      this.wasteControlProperty.value = 18;
      this.balanceProperty.value = 39;
    }
    else if ( experiment === 'membrane' ) {
      this.membraneStableProperty.value = false;
      this.energyProperty.value = 55;
      this.proteinProperty.value = 58;
      this.wasteControlProperty.value = 44;
      this.balanceProperty.value = 16;
    }
  }

  /**
   * Reset the entire simulation state.
   * @public
   */
  reset() {
    this.modeProperty.value = 'learn';
    this.selectedOrganelleProperty.value = 'nucleus';
    this.resetCell();
  }
}

export default AnimalCellModel;
