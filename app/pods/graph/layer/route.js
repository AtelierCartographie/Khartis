import Ember from 'ember';
import Project from 'mapp/models/project'; 

export default Ember.Route.extend({
  
  controllerName: "graph",
  
  renderTemplate: function() {
    this.render("graph", { outlet: 'main' });
    //this.render('graph.layer', {into: "graph", outlet: 'configuration-panel' });
    this.render("index.sidebar-sub", {into: "graph", outlet: "sidebar-sub"});
    this.render("graph.layer", {into: "index.sidebar-sub", outlet: "sidebar-sub-content"});
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
  },
  
  deactivate() {
    this.set('controller.editedLayer', null);
  },
  
  actions: {
    selectMapping(type) {
      this.get('controller').send('bindLayerMapping', type);
      Ember.run.later(this, () => {
        this.transitionTo('graph.layer.edit');
      });
    }
  }
  
});
