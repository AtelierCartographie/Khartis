import Ember from 'ember';
import ab2string from 'mapp/utils/ab2string';

export default Ember.Route.extend({
  
  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('new-project').set('currentState', 'test-data');
    this.loadFile();
  },
  
  loadFile() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/data/01_WB_emissions_CO2_structureOK_ISO-Latin-1.txt', true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
      if (this.status == 200) {
        console.log(ab2string(this.response));
      }
    };

    xhr.send();
  }
  
});
