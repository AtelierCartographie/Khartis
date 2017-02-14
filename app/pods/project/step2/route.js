import Ember from 'ember';

export default Ember.Route.extend({
  
  renderTemplate: function() {
    this.render({ outlet: "content" });
    this.render("sidebar", {outlet: "sidebar", controller: "project.step2"});
    this.render("project.step2.sidebar", {into: "sidebar", outlet: "sidebar"});
    this.render("project.step2.sidebar-bottom", {into: "sidebar", outlet: "sidebar-bottom"});
    this.render("project.step2.help", {into: "project.step2.sidebar", outlet: "help"});
    this.render("header", {into: "sidebar", outlet: "header" });
  },
  
  redirect(model) {
    if (!model.get('project.report')) {
      this.transitionTo('project.step1');
    }
  },
  
  model() {
    return this.modelFor('project');
  },
  
  setupController(controller, model) {
    this._super(controller, model);
  }
  
});
