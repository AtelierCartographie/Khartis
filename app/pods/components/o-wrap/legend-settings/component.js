import Ember from 'ember';
import WrapperAbstract from '../-abstract/component';
/* global Em */

export default WrapperAbstract.extend({

  legendTitle: Ember.computed('obj', {
    get() {
      return this.get('obj.legendTitle') || this.get('obj.legendTitleComputed');
    },
    set(k, v) {
      return this.set('obj.legendTitle', v);
    }
  }),

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

  init() {
    this._super();
  },

  actions: {
    editLayerLegend(layer) {
      this.set('obj', layer);
    }
  }
  
});
