import Ember from 'ember';
import config from 'khartis/config/environment';

export default Ember.Component.extend({
  
  tagName: "img",
  attributeBindings: ["src"],
  
  mapping: null,
  small: false,
  
  src: function() {
    let file;
    switch (this.get('mapping.type')) {
      case "quanti.val_symboles":
        file = "ordered-sym-prop";
        break;
      case "quanti.val_surfaces":
        file = "ordered-surf-ordered";
        break;
      case "quali.cat_symboles":
        if (this.get('mapping.ordered')) {
          file = "ordered-sym-ordered"
        } else {
          file = "different-sym"; 
        }
        break;
      case "quali.cat_surfaces":
        file = "different-surf";
        break;
      case "quanti.val_symboles.combined.quanti.val_surfaces":
        file = "combined-sym-ordered";
        break;
      case "quanti.val_symboles.combined.quali.cat_surfaces":
        file = "combined-sym-different";
        break;
      case "quanti.val_symboles.combined.proportional":
        file = "combined-sym-double";
        break;
      case "ordered.surf.ordered":
        file = "ordered-surf-ordered";
        break;
    }
    if (file) {
      return `${config.rootURL}assets/images/viz/${file}${this.get('small') ? '-small':''}.svg`;
    } else {
      return `${config.rootURL}assets/images/unknow.svg`;
    }
  }.property('mapping.type')
  
});
