import Ember from 'ember';
import WrapperAbstract from '../-abstract/component';
import {matcher as geoMatcher} from 'mapp/utils/geo-matcher';
/* global Em */

export default WrapperAbstract.extend({

  siblings: null,
  basemap: null,

  dictionary: function() {
    return this.get('basemap.dictionaryData');
  }.property('basemap'),

  dictionaryValue: Ember.computed('obj.correctedValue', {
    get() {
      let match = geoMatcher.match(this.get('obj.correctedValue'));
      return match ? match.value : null;
    },
    set(k,v) {
      if (v !== null) {
        this.set('obj.correctedValue', v.get(this.get('basemap.mapConfig.dictionary.identifier')));
      } else {
        this.set('obj.correctedValue', null);
      }
      return v;
    }
  }),
  
  nameKey: function() {

    let ks = [
      "name_ISO_"+this.get('i18n.locale').toUpperCase(),
      "name_"+this.get('i18n.locale').toUpperCase(),
      "Name",
      "name",
      "name_EN"
    ];
    
    for (let k of ks) {
      if (geoMatcher.keyCodes.indexOf(k) !== -1) {
        return k;
      }
    }

    return geoMatcher.keyCodes[0];

  }.property('basemap', 'i18n.locale'),
  
  filterFields: function() {
    return Em.A(basemap.get('mapConfig.dictionary.identifier'), this.get('nameKey'));
  }.property('nameKey'),
  
  correctedValueChange: function() {
    this.get('siblings').forEach( cell => cell.set('correctedValue', this.get('obj.correctedValue')));
  }.observes('obj.correctedValue')
  
});
