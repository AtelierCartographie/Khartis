import Ember from 'ember';

export default Ember.Component.extend({

  label: null,
  value: null,
  scale: null,

  init() {
    this._super();
    this.set('thresholds', Em.A());
  },

  canAddThreshold: function() {
    return this.get('scale.manualIntervals').length < 7;
  }.property('scale.manualIntervals.[]'),

  thresholdsSorted: function() {
    return this.get('scale.manualIntervals').sort((a,b) => {
      return a > b ? 1:-1;
    });
  }.property('scale.manualIntervals.[]', 'scale.valueBreak'),

  thresholdsSortedBeforeBreak: function() {
    return this.get('scale.manualIntervals')
      .filter( i => i < this.get('scale.valueBreak') )
      .sort((a,b) => {
        return a > b ? 1:-1;
      });
  }.property('scale.manualIntervals.[]', 'scale.valueBreak'),

  thresholdsSortedAfterBreak: function() {
    return this.get('scale.manualIntervals')
      .filter( i => i > this.get('scale.valueBreak') )
      .sort((a,b) => {
        return a > b ? 1:-1;
      });
  }.property('scale.manualIntervals.[]', 'scale.valueBreak'),

  actions: {
    addThreshold() {
      if (this.get('value') != null && this.get('canAddThreshold')) {
        let errMsg;
        if (this.get('value') < this.get('min') || this.get('value') > this.get('max')) {
          errMsg = "visualization.alert.threshold.extent";
        } else if (this.get('value') == this.get('scale.valueBreak')
          || this.get('value') == this.get('min') || this.get('value') == this.get('max')
          || this.get('scale.manualIntervals').indexOf(this.get('value')) !== -1) {
          errMsg = "visualization.alert.threshold.valueUsed";
        }
        if (errMsg) {
          this.get('ModalManager')
            .show('confirm', Ember.String.capitalize(this.get('i18n').t(errMsg).string),
              Ember.String.capitalize(this.get('i18n').t('visualization.alert.threshold.title').string),
              null,
              Ember.String.capitalize(this.get('i18n').t('general.cancel').string));
        } else {
          this.get('scale.manualIntervals').addObject(this.get('value'));
          this.set('value', null);
        }
        
      }
    },
    removeThreshold(val) {
      this.get('scale.manualIntervals').removeObject(val);
    }
  }

});
