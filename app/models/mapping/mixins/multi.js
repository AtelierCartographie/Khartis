import Ember from 'ember';


export const QuantiValSymQuantiValSurf = Ember.Mixin.create({

  visualization: Ember.computed('master.visualization', function() {
    return this.get('master.visualization');
  }),

  delegateRuleMode(row, mode) {
    let [master, slave] = this.get('mappings');
    let target;
    switch (mode) {
      case "fill":
        target = slave;
        break;
      default:
        target = master;
    }
    const cell = target.get('varCol').cellAtRow(row);
    const rule = target.ruleForCell(cell);
    return rule != null && target.ruleFn(rule, mode);
  },

  delegateStyleMode(row, mode) {
    let [master, slave] = this.get('mappings');
    let cell;
    switch (mode) {
      case "texture":
        cell = master.get('varCol').cellAtRow(row);
        return master.getScaleOf("texture")(cell.get('postProcessedValue'));
      case "fill":
        cell = slave.get('varCol').cellAtRow(row);
        return slave.getScaleOf("color")(cell.get('postProcessedValue'));
      case "size":
        cell = master.get('varCol').cellAtRow(row);
        return master.getScaleOf("size")(cell.get('postProcessedValue'));
      case "shape":
        return master.get('visualization.shape');
      case "strokeColor":
        return master.get('visualization.strokeColor');
      case "stroke":
        return master.get('visualization.stroke');
    }
  }

});

export const QuantiValSymQualiCatSurf = Ember.Mixin.create(QuantiValSymQuantiValSurf);


export const QuantiValSymProportional = Ember.Mixin.create({

  visualization: Ember.computed('master.visualization', function() {
    return this.get('master.visualization');
  }),

  fn() {
    return this.get('mappings').map( m => {
      return m.fn();
    });
  }

});