import Ember from 'ember';
import CSV from 'npm:csv-string';
import Project from 'mapp/models/project';
import {DataStruct} from 'mapp/models/data';
import Basemap from 'mapp/models/basemap';
import ab2string from 'mapp/utils/ab2string';
import config from 'mapp/config/environment';

export default Ember.Controller.extend({
  
  store: Ember.inject.service(),

  dictionary: Ember.inject.service(),

  basemap: null,

  importReport: null,
  
  canResumeProject: function() {
    return this.get('store').has();
  }.property('store'),
  
  parsable: function() {
    return this.get('model.csv') && this.get('model.csv').length > 0;
  }.property('model.csv'),
  
  examples: function() {
    return this.get('model.project.graphLayout.basemap.mapConfig.examples');
  }.property('model.project.graphLayout.basemap.mapConfig.examples'),
  
  loadFile(source) {
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${config.rootURL}data/examples/${source}`, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = (e) => {
      
      if (e.target.status == 200) {
        
        let data = CSV.parse(ab2string(e.target.response));

        data = data.map( r => {
          return r.map( c => c.trim() );
        });
        
        let project = this.get('model.project');
        project.importRawData(data);
        project.set('csv', null);
        this.transitionToRoute('project.step2', "new");
        
      }
      
    };

    xhr.send();
    
  },
  
  actions: {
    
    selectBasemap(mapId) {
      this.set('model.project.graphLayout.basemap', Basemap.create({id: mapId}))
        .loadDictionaryData();
    },

    resumeProject() {
      this.transitionToRoute('graph', this.get('store').list().get('lastObject._uuid'));
    },
    
    loadCsv(text) {
      this.set('model.csv', text);
    },

    parseCsvContent() {

      let sep = CSV.detect(this.get('model.csv'));

      CSV.readAll(this.get('model.csv'), sep, (data) => {
        if (data.length === 0) {
          this.get('ModalManager')
            .show('error', "Impossible d'importer le CSV",
              "Erreur lors de l'importation", 'Fermer');
        } else {
          this.get('model.project').importRawData(data);
          this.transitionToRoute('project.step2', 'new');
        }
      });
      
    },
    
    selectDataSet(set) {
      this.loadFile(set.source);
    }
    
  }
  
});
