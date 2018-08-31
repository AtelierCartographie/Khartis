import AbstractSettings from '../abstract-component';

export default AbstractSettings.extend({
  actions: {
    onIntervalTypeTabChange(t) {
      if (t === "self-domain-tab") {
        this.set('mapping.sharedDomain', false);
      } else if (t === "shared-domain-tab") {
        this.set('mapping.sharedDomain', true);
      }
    }
  }
});