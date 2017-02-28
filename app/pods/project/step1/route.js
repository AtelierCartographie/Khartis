import Ember from 'ember';

export default Ember.Route.extend({
  
  renderTemplate: function() {
    this.render({ outlet: "content" });
    this.render("sidebar", {outlet: "sidebar", controller: "project"});
    this.render("project.step1.sidebar", {into: "sidebar", outlet: "sidebar"});
    this.render("project.step1.sidebar-bottom", {into: "sidebar", outlet: "sidebar-bottom"});
    this.render("project.step1.help", {into: "project.step1.sidebar", outlet: "help"});
    this.render("header", {into: "sidebar", outlet: "header" });
  },
  
  model() {
    return this.modelFor('project');
  },
  
  setupController(controller, model) {
    this._super(controller, model);
  }
  
});
