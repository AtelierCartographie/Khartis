import Ember from 'ember';

export default Ember.Route.extend({
  
  renderTemplate: function() {
     this.render("index.sidebar", {outlet: "sidebar"});
    this.render("project.step1.sidebar", {into: "index.sidebar", outlet: "sidebar"});
    this.render("project.step1.help", {into: "index.sidebar", outlet: "help"});
    this.render("index.header", {into: "index.sidebar", outlet: "header" });
    this.render({ outlet: "main" });
  },
  
  model() {
    return this.modelFor('project');
  },
  
  setupController(controller, model) {
    this._super(controller, model);
  }
  
});
