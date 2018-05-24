import Ember from 'ember';
import WrapperAbstract from '../-abstract/component';
/* global Em */

export default WrapperAbstract.extend({

  layers: null,

  legendTitle: Ember.computed('obj', {
    get() {
      return this.get('obj.legendTitle') || this.get('obj.legendTitleComputed');
    },
    set(k, v) {
      return this.set('obj.legendTitle', v);
    }
  }),

  flattenedMappings: Ember.computed('layers.@each.mapping', function() {
    return this.get('layers').reduce( (out, lyr) => {
      if (lyr.get('mapping.isMulti')) {
        return out.concat(lyr.get('mapping.mappings'));
      } else {
        return [...out, lyr.get('mapping')];
      }
    }, []);
  }),

  orientationAvailable: function() {
    return this.get('obj.visualization.shape') !== "bar";
  }.property('obj.visualization.shape'),

  orientationHori: Ember.computed('obj.legendOrientation', {
    get() {
      return this.get('obj.legendOrientation') === "horizontal";
    },
    set(k,v) {
      if (v) {
        this.set('obj.legendOrientation', "horizontal");
      } else {
        this.set('orientationVerti', true);
      }
      return v;
    }
  }),

  orientationVerti: Ember.computed('obj.legendOrientation', {
    get() {
      return this.get('obj.legendOrientation') === "vertical";
    },
    set(k,v) {
      if (v) {
        this.set('obj.legendOrientation', "vertical");
      } else {
        this.set('orientationHori', true);
      }
      return v;
    }
  }),

  precisionSettable: Ember.computed('obj.maxValuePrecision', function() {
    return this.get('obj.maxValuePrecision') != null;
  }),

  maxValuePrecision: Ember.computed('obj.legendMaxValuePrecision', {
    get() {
      return this.get('obj.maxValuePrecision');
    },
    set(k, v) {
      this.set('obj.legendMaxValuePrecision', v);
      return this.get('obj.maxValuePrecision');
    }
  }),

  init() {
    this._super();
  },

  actions: {
    editMappingLegend(mapping) {
      this.set('obj', mapping);
    }
  }
  
});
