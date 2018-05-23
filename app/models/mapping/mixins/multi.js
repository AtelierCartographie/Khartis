import Ember from 'ember';


export const QuantiValSymQuantiValSurf = Ember.Mixin.create({

  visualization: Ember.computed('master.visualization', function() {
    return this.get('master.visualization');
  }),

  delegateStyleMode(cell, mode) {
    let [master, slave] = this.get('mappings');
    switch (mode) {
      case "texture":
        return master.getScaleOf("texture")(cell.get('postProcessedValue'));
      case "fill":
        return slave.getScaleOf("color")(cell.get('postProcessedValue'));
      case "size":
        return master.getScaleOf("size")(cell.get('postProcessedValue'));
      case "shape":
        return master.get('visualization.shape');
      case "strokeColor":
        return master.get('visualization.strokeColor');
    }
  }

});