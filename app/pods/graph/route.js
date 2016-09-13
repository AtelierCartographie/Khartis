import Ember from 'ember';
import Project from 'mapp/models/project'; 
import Projection from 'mapp/models/projection'; 
import config from 'mapp/config/environment';

export default Ember.Route.extend({
    
    store: Ember.inject.service(),
  
    renderTemplate: function() {
      this.render({ outlet: 'main' });
      this.render("sidebar", {into: "graph", outlet: "sidebar", controller: "graph"});
      this.render("header", {into: "sidebar", outlet: "header" });
      this.render("graph.sidebar", {into: "sidebar", outlet: "sidebar"});
      this.render("graph.help", {into: "graph.sidebar", outlet: "help"});

    },

    redirect(model) {
      this.transitionTo('graph');
    },
    
    model(params) {
      
      return this.get('store').select(params.uuid)
        .then( p => {
          console.log(p);
          if (p) {
            return p;
          } else {
            this.transitionTo('/');
          }
        });
      
    },
    
    afterModel(model) {
      
      if (!model.get('graphLayout.projection')) {
        if (model.get('graphLayout.basemap.mapConfig.compositeProjection')) {
          model.set('graphLayout.projection', Projection.createComposite(model.get('graphLayout.basemap.mapConfig.compositeProjection')));
        } else {
          model.set('graphLayout.projection', this.get('Dictionary.data.projections').find( p => p.id === config.projection.default ));
        }
      }

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
