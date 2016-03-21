import Ember from 'ember';
import Project from 'mapp/models/project'; 

export default Ember.Route.extend({
    
    store: Ember.inject.service(),
  
    renderTemplate: function() {
        this.render({ outlet: 'main' });
        this.render("index.header", {into: "graph", outlet: "header" });
    },
    
    redirect(model) {
      //this.transitionTo('graph.layout');
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
      console.log(this.get('store'));
      this.get('store').versions()
        .on("undo", () => { console.log("undo"); this.refresh()})
        .on("redo", () => this.refresh());
    },
    
    setupController(controller, model) {
      this._super(controller, model);
      controller.setup();
    }
    
    
});
