import Ember from 'ember';

export default Ember.Route.extend({
  
  renderTemplate: function() {
    this.render("project.step2.help", {outlet: "help"});
    this.render("project.step2.sidebar", {outlet: "sidebar"});
    this.render("index.header", {outlet: "header" });
    this.render({ outlet: "main" });
  },

  redirect(model) {
    if (!model.get('project.report')) {
      this.transitionTo('project.step3');
    }
  },
  
  model() {
    return this.modelFor('project');
  },
  
  setupController(controller, model) {
    this._super(controller, model);
  }
  
});
