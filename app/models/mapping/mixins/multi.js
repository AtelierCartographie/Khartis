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

  maxSize: Ember.computed('visualization.maxSize', {
    get() {
      return this.get('visualization.maxSize');
    },
    set(k, v) {
      let [master, slave] = this.get('mappings');
      master.set('visualization.maxSize', v);
      slave.set('visualization.maxSize', v);
      return v;
    }
  }),

  contrast: Ember.computed('master.scale.contrast', {
    get() {
      return this.get('master.scale.contrast');
    },
    set(k, v) {
      let [master, slave] = this.get('mappings');
      master.set('scale.contrast', v);
      slave.set('scale.contrast', v);
      return v;
    }
  }),

  shape: Ember.computed('master.visualization.shape', {
    get() {
      return this.get('master.visualization.shape');
    },
    set(k, v) {
      let [master, slave] = this.get('mappings');
      master.set('visualization.shape', v);
      slave.set('visualization.shape', v);
      return v;
    }
  }),

  fn() {
    return this.get('mappings').map( m => {
      return m.fn();
    });
  }

});