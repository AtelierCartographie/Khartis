import Ember from 'ember';
import Project from 'mapp/models/project'; 

export default Ember.Route.extend({
    
    store: Ember.inject.service(),
  
    renderTemplate: function() {
      this.render({ outlet: 'main' });
      this.render("index.header", {into: "graph", outlet: "header" });
    },
    
    redirect(model) {
      if (model.get('graphLayout.projection')) {
        this.transitionTo('graph');
      } else {
        this.transitionTo('graph.projection');
      }
    },
    
    model(params) {
      
      let p = this.get('store').select(params.uuid);
      
      if (p) {
        return p;
      } else {
        this.transitionTo('/');
      }
      
    },
    
    afterModel(model) {
      this.get('store').versions()
        .on("undo", () => this.refresh())
        .on("redo", () => this.refresh());
    },
    
    setupController(controller, model) {
      this._super(controller, model);
      controller.setup();
    }
    
});
