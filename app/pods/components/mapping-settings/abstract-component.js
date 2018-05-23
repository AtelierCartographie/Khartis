import Component from '@ember/component';

export default Component.extend({
  mapping: null,
  actions: {
    onIntervalTypeTabChange(id) {
      this.set('mapping.scale.usesInterval', !(id === "linear-tab"));
    },
    bindScaleIntervalType(...params) {
      this.sendAction('bindScaleIntervalType', ...params);
    },
    bind(...params) {
      this.sendAction('bind', ...params);
    },
    updateValueBreak(...params) {
      this.sendAction('updateValueBreak', ...params);
    },
    toggleRuleVisibility(...params) {
      this.sendAction('toggleRuleVisibility', ...params);
    }
  }
});