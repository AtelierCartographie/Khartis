import Ember from 'ember';
import Scale from "../scale/scale";
import ValueMixin from "./value";
import LegendMixin from "./legend";
import d3 from 'npm:d3';

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


export const QuantiValSymProportional = Ember.Mixin.create(ValueMixin.Data, LegendMixin, {

  onFinalizedChange: function() {
    if (this.get('isFinalized')) {
      let [master, slave] = this.get('mappings');
      if (!master.get('visualization.color')) {
        master.set('visualization.color', 'red');
        master.set('visualization.colorSet', 'PRGn');
      }
      if (!slave.get('visualization.color')) {
        slave.set('visualization.color', 'blue');
        slave.set('visualization.colorSet', 'BlRd');
      }
    }
  }.observes('isFinalized'),

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

  opacity: Ember.computed('master.visualization.opacity', {
    get() {
      return this.get('master.visualization.opacity');
    },
    set(k, v) {
      let [master, slave] = this.get('mappings');
      master.set('visualization.opacity', v);
      slave.set('visualization.opacity', v);
      return v;
    }
  }),

  legendStroke: 1,

  legendTitleComputed: function() {
    return this.get('legendTitle') ?
      this.get('legendTitle')
      : `${this.get('master.varCol.header.value')} + ${this.get('slave.varCol.header.value')}`;
  }.property('legendTitle', 'master.varCol.header.value', 'slave.varCol.header.value'),

  maxValuePrecision: function() {
    if (this.get('legendMaxValuePrecision') != null) {
      return this.get('legendMaxValuePrecision');
    } else {
      return Math.max(this.get('master').computeMaxValuePrecision(), this.get('slave').computeMaxValuePrecision());
    }
  }.property('legendMaxValuePrecision'),

  values: function() {
    return [
      ...this.get('master.values'),
      ...this.get('slave.values')
    ];
  }.property('master.values.[]', 'slave.values.[]'),
  
  absValues: function() {
    return this.get('values').map( v => Math.abs(v) );
  }.property('values.[]'),

  shouldDiverge: function() {
    return this.get('values').some( v => v < 0 ) && this.get('values').some( v => v >= 0 );
  }.property('values.[]'),

  intervals: function() {
    return this.get('scale').getIntervals(this.get('values'));
  }.property('values.[]'),

  extent: function() {
    return d3.extent(this.get('values'));
  }.property('values.[]'),

  extentMin: function() {
    return this.get('extent')[0];
  }.property('extent'),
  
  extentMax: function() {
    return this.get('extent')[1];
  }.property('extent'),

  rules: function() {
    return [
      ...this.get('master.rules'),
      ...this.get('slave.rules')
    ];
  }.property('master.rules.[]', 'slave.rules.[]'),

  onSharedDomainChange: function() {
    if (this.get('sharedDomain')) {
      if (this.get('shouldDiverge')) {
        this.set('scale.valueBreak', 0);
      }
    }
  }.observes('sharedDomain'),

  getScaleOf(type) {
    switch (type) {
      case "color":
        return () => "rgba(255, 255, 255, 0)";
      default:
        return this.get('master').getScaleOf(type, this);
    }
  },

  fn() {
    return this.get('mappings').map( m => {
      return m.fn(this.get('sharedDomain') ? this : undefined);
    });
  }

});