import AbstractSettings from '../abstract-component';

export default AbstractSettings.extend({
  withPatternSettings: true,
  actions: {
    bindPattern(pattern) {
      this.set('mapping.visualization.pattern', pattern.fork());
    },
  }
});