import Ember from 'ember';
import Project from 'khartis/models/project'; 

export default Ember.Route.extend({
  
  controllerName: "graph",
  
  renderTemplate: function() {
    this.render("graph", { outlet: 'main' });
    this.render("sidebar-sub", {into: "graph", outlet: "sidebar-sub"});
    this.render("graph.layer.edit", {into: "sidebar-sub", outlet: "sidebar-sub-content"});
  },
  
  model(params) {
    let layer = this.modelFor('graph.layer');
    if (layer.get('mapping.type')) {
      
      if (layer.get('mapping.rules').length > 30) {
        return this.get('ModalManager')
          .show('confirm', Ember.String.capitalize(this.get('i18n').t('visualization.alert.bigDataSet.content').string),
            Ember.String.capitalize(this.get('i18n').t('visualization.alert.bigDataSet.title').string),
            Ember.String.capitalize(this.get('i18n').t('general.yes').string),
            Ember.String.capitalize(this.get('i18n').t('general.cancel').string))
          .then(() => {
            return layer;
          }).catch( () => {
            this.transitionTo('graph.layer');
          });
      } else {
        return layer;
      }
      
    } else {
      this.transitionTo('graph.layer');
    }
  },
  
  setupController(controller, model) {
    //override with nothing
  }
  
});
