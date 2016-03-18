import Ember from 'ember';

export default Ember.Controller.extend({

  store: Ember.inject.service(),

  hasWarnings: function() {
    return this.get('model.project.report.warnings').length > 0;
  }.property('model.project.report.warnings'),

  hasErrors: function() {
    return this.get('model.project.report.errors').length > 0;
  }.property('model.project.report.errors'),
  
  bodyPreview: function() {
    return this.get('model.project.data.body').slice(0, 10);
  }.property('model.project.data.body.[]'),

  actions: {

    back() {
      this.transitionToRoute('project.step1');
    },

    next(){
      this.get('store').merge(this.get('model.project'));
      this.transitionToRoute('graph', this.get('model.project._uuid'));
    }

  }

});
