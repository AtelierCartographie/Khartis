import Ember from 'ember';
import CSV from 'npm:csv-string';
/* global Em */

const SETS = [
  
  {
    name: "Emissions CO2",
    source: "01_WB_emissions_CO2_structureOK_ISO-Latin-1.txt"
  },
  {
    name: "Surfaces de forêts",
    source: "02_WB_surfaces_forets_Km2_EN_milliers-virgule_decimal-point_ISO-Latin-1.txt"
  }
  
]

export default Ember.Route.extend({
  
  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('new-project').set('currentState', 'test-data');
  },
  
  model() {
    return Em.A(SETS);
  }
  
});
