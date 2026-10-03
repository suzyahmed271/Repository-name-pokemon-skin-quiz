// Copyright 2015-2026, University of Colorado Boulder

/**
 * Screen definition for the Animal Cell Systems Lab.
 *
 * @author Suzan Ahmed Mustafa
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import StringProperty from '../../../axon/js/StringProperty.js';
import AnimalCellModel from './AnimalCellModel.js';
import AnimalCellScreenView from './AnimalCellScreenView.js';

class AnimalCellScreen extends Screen {
  constructor() {
    super(
      () => new AnimalCellModel(),
      model => new AnimalCellScreenView( model ),
      {
        name: new StringProperty( 'Animal Cell Systems Lab' ),
        backgroundColorProperty: new Property( '#EAF7FC' )
      }
    );
  }
}

export default AnimalCellScreen;
