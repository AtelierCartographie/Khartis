import Ember from 'ember';

export default Ember.Route.extend({
  
  renderTemplate: function() {
    this.render("project.step1.help", {outlet: "help"});
    this.render("project.step1.sidebar", {outlet: "sidebar"});
    this.render("index.header", {outlet: "header" });
    this.render({ outlet: "main" });
  },
  
  model() {
    return this.modelFor('project');
  },
  
  setupController(controller, model) {
    this._super(controller, model);
  }
  
});
