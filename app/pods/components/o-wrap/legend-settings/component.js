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

  init() {
    this._super();
  },

  actions: {
    editLayerLegend(layer) {
      this.set('obj', layer);
    }
  }
  
});
