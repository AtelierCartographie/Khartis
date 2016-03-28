import Ember from 'ember';
import CSV from 'npm:csv-string';
import ab2string from 'mapp/utils/ab2string';
import config from 'mapp/config/environment';
import Projection from 'mapp/models/projection';

let csvHeaderToJs = function(str) {
  str = str.replace(/^\./, "")
    .replace(/[\.\s\-]/g, "_");
  return str.charAt(0).toLowerCase() + str.slice(1);
}

var Dictionnary = Ember.Service.extend(Ember.Evented, {
	
  data: Em.Object.create(),
  
  load: function() {
    
    let promises = [
      this._loadProjections(),
      this._loadWorldBank(),
    ];
    
    return Promise.all(promises);
    
  },
	
	_loadProjections: function() {
		
    return new Promise( (res, rej) => {
      
      let xhr = new XMLHttpRequest();
      xhr.open('GET', `${config.baseURL}data/Projection-list.csv`, true);
      xhr.responseType = 'arraybuffer';

      xhr.onload = (e) => {
        
        if (e.target.status == 200) {
          
          let data = CSV.parse(ab2string(e.target.response));
          data = data.map( r => {
            return r.map( c => c.trim() );
          });
          
          let headers = data[0],
              body = data.slice(1),
              json = body.map( r => {
                let o = {};
                headers.forEach( (h,i) => o[csvHeaderToJs(h)] = r[i] );
                return o;
              });
          
          this.set('data.projections', json.map( j => Projection.create(j) ));
          res(true);
          
        }
        
      };

      xhr.send();
      
    });
		
	},
  
	_loadWorldBank: function() {
		
    return new Promise( (res, rej) => {
      
      let xhr = new XMLHttpRequest();
      xhr.open('GET', `${config.baseURL}data/world-dictionnary.json`, true);

      xhr.onload = (e) => {
        
        if (e.target.status == 200) {
          this.set('data.worldBank', JSON.parse(e.target.responseText).map( x => Ember.Object.create(x)));
          res(true);
          
        }
        
      };

      xhr.send();
      
    });
		
	}
	
});

export default Dictionnary;
