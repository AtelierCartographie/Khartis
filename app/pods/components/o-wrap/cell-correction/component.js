import Ember from 'ember';
import WrapperAbstract from '../-abstract/component';
import {matcher as geoMatcher} from 'khartis/utils/geo-matcher';
/* global Em */

export default WrapperAbstract.extend({

  siblings: null,
  dictionary: null,
  nameKey: null,
  idKey: null,

  dictionaryValue: Ember.computed('obj.correctedValue', {
    get() {
      let match = geoMatcher.match(this.get('obj.correctedValue'));
      return match ? match.value : null;
    },
    set(k,v) {
      if (v !== null) {
        this.set('obj.correctedValue', v.get(this.get('idKey')));
      } else {
        this.set('obj.correctedValue', null);
      }
      this.sendAction('manuallyEdited', this.get('obj'));
      return v;
    }
  }),
  
  filterFields: function() {
    return Em.A(basemap.get('mapConfig.dictionary.identifier'), this.get('nameKey'));
  }.property('nameKey'),
  
  correctedValueChange: function() {
    this.get('siblings').forEach( cell => cell.set('correctedValue', this.get('obj.correctedValue')));
  }.observes('obj.correctedValue')
  
});
