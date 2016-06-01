import Ember from 'ember';

export default Ember.Route.extend({
  
  renderTemplate: function() {
    this.render("index.sidebar", {outlet: "sidebar"});
    this.render("project.step2.sidebar", {into: "index.sidebar", outlet: "sidebar"});
    this.render("project.step2.help", {into: "index.sidebar", outlet: "help"});
    this.render("index.header", {into: "index.sidebar", outlet: "header" });
    //this.render("", {outlet: "sidebar-sub"});
    this.render({ outlet: "main" });
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
