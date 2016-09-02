import Ember from 'ember';
import VisualizationFactory from '../visualization/factory';

let VisualizationMixin = Ember.Mixin.create({

  generateVisualization() {
    if (!this.get('visualization')) {
      this.set('visualization', VisualizationFactory.createInstance("text"));
    }
  }

});

export default {Visualization: VisualizationMixin};
