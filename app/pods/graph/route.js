import Ember from 'ember';
import Project from 'mapp/models/project'; 

export default Ember.Route.extend({
  
    renderTemplate: function() {
        this.render({ outlet: 'main' });
        this.render('graph/sidebar', { outlet: 'sidebar' });
    },
    
    model(params) {
      
      let p = this.get('store').select(params.uuid);
      
      if (p) {
        return Project.restore(p);
      } else {
        this.transitionTo('/');
      }
      
    },
    
    setupController(controller, model) {
      this._super(controller, model);
      controller.setup();
    }
    
    
});
