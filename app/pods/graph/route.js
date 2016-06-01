import Ember from 'ember';
import Project from 'mapp/models/project'; 
import config from 'mapp/config/environment';

export default Ember.Route.extend({
    
    store: Ember.inject.service(),
  
    renderTemplate: function() {
      this.render({ outlet: 'main' });
      this.render("index.header", {into: "graph", outlet: "header" });
    },
    
    redirect(model) {
      this.transitionTo('graph');
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
      
      if (!model.get('graphLayout.projection')) {
        model.set('graphLayout.projection', this.get('Dictionnary.data.projections').find( p => p.id === config.projection.default ));
      }
      console.log(!model.get('geoDef'), model.get('data.availableGeoDefs'));
      if (!model.get('geoDef') && model.get('data.availableGeoDefs').length > 0) {
        model.set('geoDef', model.get('data.availableGeoDefs').objectAt(0));
      }
      
      this.get('store').versions()
        .on("undo", () => this.refresh())
        .on("redo", () => this.refresh());
        
    },
    
    setupController(controller, model) {
      this._super(controller, model);
      controller.setup();
    },
    
    actions: {
      
      toggleProjection() {
        this.transitionTo('graph.projection');
      }
      
    }
    
});
