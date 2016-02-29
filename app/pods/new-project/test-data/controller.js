import Ember from 'ember';
import ab2string from 'mapp/utils/ab2string';
import Project from 'mapp/models/project';
import {DataStruct} from 'mapp/models/data';
import config from 'mapp/config/environment';
import CSV from 'npm:csv-string';

export default Ember.Controller.extend({
  
  loadFile(source) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${config.baseURL}data/${source}`, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = (e) => {
      
      if (e.target.status == 200) {
        
        let data = CSV.parse(ab2string(e.target.response));
        data = data.map( r => {
          return r.map( c => c.trim() );
        });
        
        let project = Project.create({
          data: DataStruct.createFromRawData(data)
        });
        this.get('store').persist(project);
        this.transitionToRoute('spreadsheet', project.get('_uuid'));
        
      }
      
    };

    xhr.send();
    
  },
  
  actions: {
    
    selectDataset(set) {
      this.loadFile(set.source);
    }
    
  }
  
});
