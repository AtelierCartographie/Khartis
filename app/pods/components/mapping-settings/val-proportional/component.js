import AbstractSettings from '../abstract-component';

export default AbstractSettings.extend({
  
  sharedDomainDiverging: function() {
    return this.get('mapping.sharedDomain') && this.get('mapping.scale.diverging');
  }.property('mapping.sharedDomain', 'mapping.scale.diverging'),

  actions: {
    updateValueBreak(mapping, val) {
      if (Ember.isEmpty(val)) {
        mapping.set('scale.valueBreak', null);
      } else {
        mapping.set('scale.valueBreak', val);
        mapping.clampValueBreak();
      }
    },
    onIntervalTypeTabChange(t) {
      if (t === "self-domain-tab") {
        this.set('mapping.sharedDomain', false);
      } else if (t === "shared-domain-tab") {
        this.set('mapping.sharedDomain', true);
      }
    }
  }
});