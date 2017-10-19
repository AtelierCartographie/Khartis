import Ember from 'ember';
import Struct from '../struct';
import Pattern from './pattern';
import {CellStruct} from '../data';

const visualizationProxy = function(prop) {
  return Ember.computed(`visualization.${prop}`, {
    get() {
      return this.get(`visualization.${prop}`);
    },
    set(k, v) {
      return this.get(`visualization.${prop}`);
    }
  })
};

let Rule = Struct.extend({
  
  cells: null,
  label: null,
  shape: null,
  visible: true,
  color: "#CCCCCC",
  strokeColor: "#404040",
  size: 2,
  pattern: null,

  deferredChange: Ember.debouncedObserver(
    'color', 'strokeColor', 'visible',
    'pattern', 'pattern.stroke', 'shape', 'size', 'index',
    function() {
      this.notifyDefferedChange();
    },
    50),

  emptyValue: function() {
    return this.get('label') === Rule.EMPTY_VALUE;
  }.property('label'),
  
  qty: function() {
    return this.get('cells').length;
  }.property('cells.[]'),
  
  export(props) {
    return this._super(Object.assign({
      cells: this.get('cells') ? this.get('cells').map( c => c._uuid ) : null,
      label: this.get('label'),
      shape: this.get('shape'),
      visible: this.get('visible'),
      color: this.get('color'),
      strokeColor: this.get('strokeColor'),
      pattern: (this.get('pattern') && this.get('pattern').export()) || null,
      size: this.get('size')
    }, props))
  }
  
});

Rule.reopenClass({
  
  EMPTY_VALUE: "no_value",
  
  restore(json, refs = {}, opts = {}) {
    return this._super(json, refs, {
      ...opts,
      cells: json.cells ? json.cells.map( cId => refs[cId] ) : null,
      label: json.label,
      shape: json.shape,
      visible: json.visible,
      color: json.color,
      strokeColor: json.strokeColor,
      pattern: (json.pattern && Pattern.restore(json.pattern, refs)) || null,
      size: json.size
    });
  }
});

let AbstractOrderedRule = Rule.extend({
  
  type: null, //to be overwritten
  index: 0,
  visualization: null,

  export(props) {
    return this._super(Object.assign({
      type: this.get('type'),
      index: this.get('index'),
      visualization: this.get('visualization')._uuid
    }, props))
  }
  
});

AbstractOrderedRule.reopenClass({
  
  restore(json, refs = {}, opts = {}) {
    return this._super(json, refs, {
      ...opts,
      type: json.type,
      index: json.index,
      visualization: refs[json.visualization]
    });
  }
});

let OrderedSymbolRule = AbstractOrderedRule.extend({
  
  type: "ordered-symbol",

  color: visualizationProxy('color'),
  strokeColor: visualizationProxy('strokeColor'),
  stroke: visualizationProxy('stroke'),
  size: Ember.computed('visualization.maxSize', 'index', {
    get() {
      return this.get('visualization.maxSize') + Math.pow(this.get('index')+1, 2);
    },
    set(k, v) {
      return v;
    }
  })
  
});

let OrderedSurfaceRule = AbstractOrderedRule.extend({
  type: "ordered-surface"
});

const RuleFactory = function(json, refs) {
  if (json.type === "ordered-symbol") {
    return OrderedSymbolRule.restore(json, refs);
  } else if (json.type === "ordered-surface") {
    return OrderedSurfaceRule.restore(json, refs);
  }
  return Rule.restore(json, refs);
};

export default Rule;
export {RuleFactory, OrderedSymbolRule, OrderedSurfaceRule};
