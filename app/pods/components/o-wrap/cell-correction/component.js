import Ember from 'ember';
import WrapperAbstract from '../-abstract/component';
import {matcher as geoMatcher} from 'mapp/utils/geo-matcher';
/* global Em */

export default WrapperAbstract.extend({

  siblings: null,

  worldBank: function() {
    return this.get('Dictionary.data.worldBank');
  }.property(),
  
  worldBankValue: Ember.computed('obj.correctedValue', {
    get() {
      let match = geoMatcher.match(this.get('obj.correctedValue'));
      return match ? match.value : null;
    },
    set(k,v) {
      if (v !== null) {
        this.set('obj.correctedValue', v.get('iso_a2'));
      } else {
        this.set('obj.correctedValue', null);
      }
      return v;
    }
  }),
  
  worldBankNameKey: function() {
    let k = "name_ISO_"+this.get('i18n.locale').toUpperCase();
    
    if (geoMatcher.keyCodes.indexOf(k) === -1) {
      k = "name_ISO_EN";
    }
    
    return k;
  }.property('i18n.locale'),
  
  worldBankFilterFields: function() {
    return Em.A('iso_a3', this.get('worldBankNameKey'));
  }.property('worldBankNameKey'),
  
  correctedValueChange: function() {
    this.get('siblings').forEach( cell => cell.set('correctedValue', this.get('obj.correctedValue')));
  }.observes('obj.correctedValue')
  
});
