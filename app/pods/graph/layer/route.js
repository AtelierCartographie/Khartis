import Ember from 'ember';
import Project from 'khartis/models/project'; 

export default Ember.Route.extend({
  
  controllerName: "graph",
  
  renderTemplate: function() {
    this.render("sidebar-sub", {into: "graph", outlet: "sidebar-sub"});
    this.render("graph.layer", {into: "sidebar-sub", outlet: "sidebar-sub-content"});
  },
  
  model(params) {
    let layer = this.modelFor('graph').get('graphLayers').find( gl => gl.get('_uuid') === params.layerId);
    if (layer) {
      return layer;
    } else {
      this.transitionTo('graph');
    }
  },
  
  setupController(controller, model) {
    controller.set('editedLayer', model);
    controller.set('sidebarSubExpanded', true);
  },
  
  deactivate() {
    this.set('controller.editedLayer', null);
    this.set('controller.sidebarSubExpanded', false);
  },
  
  actions: {
    selectMapping(type, ordered = false) {
      switch (type) {
        case "ordered.surf.ordered":
          this.transitionTo('graph.layer.configOrderedSurf');
          break;
        default:
          this.get('controller').send('bindLayerMapping', type, ordered);
          Ember.run.later(this, () => {
            this.transitionTo('graph.layer.edit');
          });
      }
    }
  }
  
});
