import Ember from 'ember';
import Project from 'mapp/models/project'; 

export default Ember.Route.extend({
  
  controllerName: "graph",
  
  renderTemplate: function() {
    this.render("graph", { outlet: 'main' });
    this.render('graph.column', {into: "graph", outlet: 'configuration-panel' });
  },
  
  model(params) {
    let col = this.modelFor('graph').get('data.columns').find( c => c.get('_uuid') === params.columnId);
    if (col) {
      return col;
    } else {
      this.transitionTo('graph');
    }
  },
  
  setupController(controller, model) {
    controller.set('editedColumn', model);
    this.set('controller.displayProjection', false);
  },
  
  deactivate() {
    this.set('controller.editedColumn', null);
    this.set('controller.displayProjection', true);
  }
    
});
