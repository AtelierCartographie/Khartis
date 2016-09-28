import Ember from 'ember';
import CSV from 'npm:csv-string';
import ab2string from 'mapp/utils/ab2string';
import config from 'mapp/config/environment';
import Projection from 'mapp/models/projection';
import {csvHeaderToJs} from 'mapp/utils/csv-helpers';

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
      
      this.set('data.maps', config.maps);
      res(true);

    });
		
	}
  
	
});

export default Dictionary;
