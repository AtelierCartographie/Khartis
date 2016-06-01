import Ember from 'ember';
import Project from 'mapp/models/project'; 

export default Ember.Route.extend({
  
  controllerName: "graph",
  
  renderTemplate: function() {
    this.render("graph", { outlet: 'main' });
    this.render('graph.projection', {into: "graph", outlet: 'configuration-panel' });
  },
  
  model(params) {
    return this.modelFor('graph').get('graphLayout.projection');
  },
  
  setupController(controller, model) {
  },
  
  deactivate() {
  },
  
  actions: {
    
    selectProjection(proj) {
      this.get('controller').send('bindProjection', proj);
      Ember.run.later(this, () => {
        this.transitionTo('graph');
      });
    },
    
    toggleProjection() {
      this.transitionTo('graph');
    }
    
  }

});
