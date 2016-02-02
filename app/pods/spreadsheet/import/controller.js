import Ember from 'ember';
import CSV from 'npm:csv-string';

export default Ember.Controller.extend({
  
  history: Ember.inject.service(),
  
  actions: {
    parseCsvContent: function(text) {
      let data = CSV.parse(text);
      this.get('model').importRawData(data);
      this.get('history').save(this.get('model'));
      this.transitionTo('spreadsheet');
    }
  }
  
});
