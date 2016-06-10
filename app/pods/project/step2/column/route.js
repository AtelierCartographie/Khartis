import Ember from 'ember';
import Project from 'mapp/models/project'; 

export default Ember.Route.extend({
  
  controllerName: "project/step2",
  
  renderTemplate: function() {
    this.render("sidebar-sub", {into: "project", outlet: "sidebar-sub"});
    this.render("project.step2.column", {into: "sidebar-sub", outlet: "sidebar-sub-content"});
  },
  
  model(params) {
    let col = this.modelFor('project.step2').get('project.data.columns').find( c => c.get('_uuid') === params.columnId);
    if (col) {
      return col;
    } else {
      this.transitionTo('project.step2');
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
