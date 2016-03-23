import Ember from 'ember';
import Project from 'mapp/models/project'; 

export default Ember.Route.extend({
  
  controllerName: "graph",
  
  renderTemplate: function() {
    this.render("graph", { outlet: 'main' });
    this.render('graph.layer.edit', {into: "graph", outlet: 'configuration-panel' });
  },
  
  model(params) {
    let layer = this.modelFor('graph.layer');
    if (layer.get('mapping')) {
      return layer;
    } else {
      this.transitionTo('graph.layer');
    }
  },
  
  setupController(controller, model) {
    //override with nothing
  }
  
});
