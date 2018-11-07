import Ember from 'ember';
import config from 'khartis/config/environment';

export default Ember.Component.extend({
  
  tagName: "span",
  
  mapping: null,
  
  title: function() {
    switch (this.get('mapping.type')) {
      case "quanti.val_symboles":
        return "visualization.type.ordered.sym.proportional";
      case "quanti.val_surfaces":
        return "visualization.type.ordered.surf.ordered";
      case "quali.cat_symboles":
        if (this.get('mapping.ordered')) {
          return "visualization.type.ordered.sym.ordered";
        } else {
          return "visualization.type.different.sym";
        }
      case "quali.cat_surfaces":
        if (this.get('mapping.ordered')) {
          return "visualization.type.ordered.surf.ordered";
        } else {
          return "visualization.type.different.surf";
        }
      case "quanti.val_symboles.combined.quanti.val_surfaces":
        return "visualization.type.combined.sym.ordered";
      case "quanti.val_symboles.combined.quali.cat_surfaces":
        return "visualization.type.combined.sym.different";
      case "quanti.val_symboles.combined.proportional":
        return "visualization.type.combined.sym.double";
      case "ordered.surf.ordered":
        return "visualization.type.ordered.surf.ordered";
    }
  }.property('mapping.type')
  
});
