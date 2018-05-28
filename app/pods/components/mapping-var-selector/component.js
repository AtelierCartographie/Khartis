import Component from '@ember/component';
import Mapping from 'khartis/models/mapping/mapping';
import ValueMixins from 'khartis/models/mapping/mixins/value';
import CategoryMixins from 'khartis/models/mapping/mixins/category';

export default Component.extend({
  variables: null,
  mapping: null,

  availableVariables: function() {
    let excludes = [];
    if (this.get('mapping') && this.get('variables')) {
      if (ValueMixins.Data.detect(this.get('mapping'))) {
        excludes.push(v => v.get('meta.type') !== 'numeric');
      }
      return this.get('variables').filter( v => {
        return !excludes.some( ex => ex(v) );
      });
    }
    return [];
  }.property('variables', 'mapping'),

  isMappedOnSymbol: function() {
    return ValueMixins.Symbol.detect(this.get('mapping'))
      || CategoryMixins.Symbol.detect(this.get('mapping'));
  }.property('mapping'),

  isMappedOnSurface: function() {
    return ValueMixins.Surface.detect(this.get('mapping'))
      || CategoryMixins.Surface.detect(this.get('mapping'));
  }.property('mapping'),

  actions: {
    select(variable) {
      Ember.run(() => {
        this.set('mapping.varCol', variable);
        this.get('mapping').finalize();
      });
    }
  }
});