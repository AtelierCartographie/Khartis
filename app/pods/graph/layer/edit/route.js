import Ember from 'ember';
import Project from 'mapp/models/project'; 

export default Ember.Route.extend({
  
  controllerName: "graph",
  
  renderTemplate: function() {
    this.render("graph", { outlet: 'main' });
    this.render("index.sidebar-sub", {into: "graph", outlet: "sidebar-sub"});
    this.render("graph.layer.edit", {into: "index.sidebar-sub", outlet: "sidebar-sub-content"});
  },
  
  model(params) {
    let layer = this.modelFor('graph.layer');
    if (layer.get('mapping.type')) {
      
      if (layer.get('mapping.rules').length > 30) {
        return this.get('ModalManager')
          .show('confirm', "Ce calque contient beaucoup de valeurs et cela pourra nuire aux performances de l'application. Voulez-vous continuer ?",
            "Attention", 'Oui', 'Annuler')
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
