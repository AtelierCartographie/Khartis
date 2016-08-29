import Ember from 'ember';
import CSV from 'npm:csv-string';
import Project from 'mapp/models/project';
import {DataStruct} from 'mapp/models/data';
import ab2string from 'mapp/utils/ab2string';
import config from 'mapp/config/environment';

export default Ember.Controller.extend({
  
  store: Ember.inject.service(),
  
  importReport: null,
  
  canResumeProject: function() {
    return this.get('store').has();
  }.property('store'),
  
  parsable: function() {
    return this.get('model.csv') && this.get('model.csv').length > 0;
  }.property('model.csv'),
  
  testDataSets: function() {
    return config.examples;
  }.property(),
  
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
        
        let project = Project.create();
        project.importRawData(data);
        this.set('model.project', project);
        this.transitionToRoute('project.step2', "new");
        
      }
      
    };

    xhr.send();
    
  },
  
  actions: {
    
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
