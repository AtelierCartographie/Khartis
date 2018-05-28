import Component from '@ember/component';
import MultiMapping from 'khartis/models/mapping/multi-mapping';

export default Component.extend({

  layer: null,

  availableMappings: function() {
    return [
      {id: "quanti.val_symboles.combined.quanti.val_surfaces", img: "QUALI-cat_surfaces.svg"},
      {id: "quanti.val_symboles.combined.quali.cat_surfaces", img: "QUALI-cat_surfaces.svg"}
    ]
  }.property('layer.mapping'),

  actions: {
    select({id}) {
      this.get('layer').set('mapping', MultiMapping.create({
        type: id,
        mappings: [this.get('layer.mapping')],
        geoDef: this.get('layer.mapping.geoDef')
      }));
    }
  }
});