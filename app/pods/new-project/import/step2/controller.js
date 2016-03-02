import Ember from 'ember';

export default Ember.Controller.extend({
  
  store: Ember.inject.service(),
  
  parsable: function() {
    return this.get('model.csv') && this.get('model.csv').length > 0;
  }.property('model.csv'),
  
  hasWarnings: function() {
    return this.get('model.project.report.warnings').length > 0;
  }.property('model.project.report.warnings'),
  
  hasErrors: function() {
    return this.get('model.project.report.errors').length > 0;
  }.property('model.project.report.errors'),
  
  actions: {
    
    back() {
      this.transitionToRoute('new-project.import.step1');
    },

    finalize() {
      this.get('store').merge(this.get('model.project'));
      this.transitionToRoute('graph', this.get('model.project').get('_uuid'));
    }
    
  }
  
});
