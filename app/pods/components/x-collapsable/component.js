import Component from '@ember/component';

export default Component.extend({
  tagName: '',
  collapsed: true,

  actions: {
    toggle() {
      this.toggleProperty('collapsed');
    }
  }

});