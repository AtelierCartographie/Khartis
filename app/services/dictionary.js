import Ember from 'ember';
import CSV from 'npm:csv-string';
import ab2string from 'khartis/utils/ab2string';
import config from 'khartis/config/environment';
import Projection from 'khartis/models/projection';
import {csvHeaderToJs} from 'khartis/utils/csv-helpers';

var Dictionary = Ember.Service.extend(Ember.Evented, {
	
  data: Em.Object.create(),
  
  load: function() {
    
    let promises = [
      this._loadMaps()
    ];
    
    return Promise.all(promises);
    
  },

  _loadMaps: function() {
		
    return new Promise( (res, rej) => {
      
      this.set('data.maps', Em.A(config.maps));
      res(true);

    });
		
  },
  
  addImportedMap: function(map) {
    this.get('data.maps').push(map);
  }
  
	
});

export default Dictionary;
