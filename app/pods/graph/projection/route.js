import Ember from 'ember';
import Project from 'mapp/models/project'; 

export default Ember.Route.extend({
  
  controllerName: "graph",
  
  renderTemplate: function() {
    this.render("graph", { outlet: 'main' });
    this.render('graph.projection', {into: "graph", outlet: 'configuration-panel' });
  },
  
  actions: {
    selectProjection(proj) {
      this.get('controller').send('bindProjection', proj);
      Ember.run.later(this, () => {
        this.transitionTo('graph.projection.edit');
      });
    }
  }

});
