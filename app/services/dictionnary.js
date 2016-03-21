import Ember from 'ember';
import CSV from 'npm:csv-string';
import ab2string from 'mapp/utils/ab2string';
import config from 'mapp/config/environment';

var Dictionnary = Ember.Service.extend(Ember.Evented, {
	
  data: Em.Object.create(),
  
  load: function() {
    
    let promises = [
      this._loadProjections()
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
          
          this.set('data.projections', data);
          res(data);
          
        }
        
      };

      xhr.send();
      
    });
		
	}
	
});

export default Dictionnary;
