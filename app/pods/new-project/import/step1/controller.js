import Ember from 'ember';
import CSV from 'npm:csv-string';

export default Ember.Controller.extend({
  
  store: Ember.inject.service(),
  
  importReport: null,
  
  parsable: function() {
    return this.get('model.csv') && this.get('model.csv').length > 0;
  }.property('model.csv'),
  
  actions: {
    
    loadCsv(text) {
      this.set('model.csv', text);
    },

    parseCsvContent() {
      
      //set loader
      
      CSV.readAll(this.get('model.csv'), (data) => {
        //stop loader
        this.get('model.project').importRawData(data);
        this.transitionToRoute('new-project.import.step2');
      });
      
    }
    
  }
  
});
