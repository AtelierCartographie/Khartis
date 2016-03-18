import Ember from 'ember';
import Project from 'mapp/models/project'; 

export default Ember.Route.extend({
  
    renderTemplate: function() {
        this.render({ outlet: 'main' });
        this.render("index.header", {into: "graph", outlet: "header" });
    },
    
    redirect(model) {
      this.transitionTo('graph.layout');
    },
    
    model(params) {
      
      let p = this.get('store').select(params.uuid);
      
      if (p) {
        return p;
      } else {
        this.transitionTo('/');
      }
      
    },
    
    setupController(controller, model) {
      this._super(controller, model);
      controller.setup();
    }
    
    
});
