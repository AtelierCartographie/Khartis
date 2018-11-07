import Ember from 'ember';
import Project from 'khartis/models/project'; 

export default Ember.Route.extend({
  
  controllerName: "graph",

  documentationService: Ember.inject.service('documentation'),
  
  renderTemplate: function() {
    this.render("sidebar-sub", {into: "graph", outlet: "sidebar-sub"});
    this.render("graph.layer.configOrderedSurf", {into: "sidebar-sub", outlet: "sidebar-sub-content"});
  },
  
  model(params) {
    let layer = this.modelFor('graph.layer');
    if (layer) {
      return layer;
    } else {
      this.transitionTo('graph');
    }
  },
  
  setupController(controller, model) {
    //nothing
  },
  
  actions: {
    openDocumentation() {
      this.get('documentationService').trigger("openAtUrl", "couleurs-ordonnees/index.html");
    }
  }

});
