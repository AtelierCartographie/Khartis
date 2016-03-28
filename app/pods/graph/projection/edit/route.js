import Ember from 'ember';
import Project from 'mapp/models/project'; 

export default Ember.Route.extend({
  
  controllerName: "graph",
  
  renderTemplate: function() {
    this.render("graph", { outlet: 'main' });
    this.render('graph.projection.edit', {into: "graph", outlet: 'configuration-panel' });
  },
  
  redirect(model) {
    if (!this.modelFor('graph').get('graphLayout.projection')) {
      this.transitionTo('graph.projection');
    }
  },
  
  setupController(controller, model) {
    //nothing
  }
    
});
