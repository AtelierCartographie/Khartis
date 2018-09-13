import Ember from 'ember';
import VisualizationFactory from '../visualization/factory';

let VisualizationMixin = Ember.Mixin.create({

  generateRules() {
    this.set("rules", []);
    this._super();
  },

  generateVisualization() {
    if (!this.get('visualization')) {
      this.set('visualization', VisualizationFactory.createInstance("text"));
    }
  }

});

export default {Visualization: VisualizationMixin};
