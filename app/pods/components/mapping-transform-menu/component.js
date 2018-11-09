import Component from '@ember/component';
import MultiMapping from 'khartis/models/mapping/multi-mapping';

export default Component.extend({

  layer: null,

  availableMappings: function() {
    return [
      {type: "quanti.val_symboles.combined.quanti.val_surfaces", img: "combined-sym-ordered.svg"},
      {type: "quanti.val_symboles.combined.quali.cat_surfaces", img: "combined-sym-different.svg"},
      {type: "quanti.val_symboles.combined.proportional", img: "combined-sym-double.svg"}
    ]
  }.property('layer.mapping'),

  actions: {
    select({type}) {
      this.get('layer').set('mapping', MultiMapping.create({
        type,
        mappings: [this.get('layer.mapping')],
        geoDef: this.get('layer.mapping.geoDef')
      }));
    }
  }
});