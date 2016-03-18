import Ember from 'ember';
import Project from 'mapp/models/project'; 

export default Ember.Route.extend({
  
  controllerName: "graph",
  
  renderTemplate: function() {
    this.render("graph", { outlet: 'main' });
    this.render('graph.layout.sidebar', {into: "graph", outlet: 'sidebar' });
  },
  
  setupController(controller, model) {
    controller.set('state', 'layout');
  }
    
});
