import Ember from 'ember';

export default Ember.Component.extend({

  classNameBindings: ['expanded'],

  expanded: false,
  history: null,
  historyCursor: -1,
  iframe: null,
  pushToHistory: true,

  init() {
    this._super();
    this.set('history', Em.A([]));
  },

  canGoBack: function() {
    return this.get('history').length > 1 && this.get('historyCursor') > 0;
  }.property('history.[]', 'historyCursor'),

  canGoForward: function() {
    return this.get('historyCursor') < this.get('history').length - 1;
  }.property('history.[]', 'historyCursor'),

  actions: {
    toggleContent() {
      this.toggleProperty('expanded');
    },
    onIframeLoad(e) {
      let iframe = e.target;
      if (this.get('iframe') != iframe) {
        this.set('iframe', iframe);
      }
      if (this.get('pushToHistory')) {
        this.get('history').push(iframe.contentWindow.location.href);
        this.set('historyCursor', this.get('history').length - 1);
      }
      this.set('pushToHistory', true);
    },
    back() {
      if (this.get('canGoBack')) {
        this.decrementProperty('historyCursor');
        this.get('iframe').contentWindow.location.href = this.get('history')[this.get('historyCursor')];
        this.set('pushToHistory', false);
      }
    },
    forward() {
      if (this.get('canGoForward')) {
        this.incrementProperty('historyCursor');
        this.get('iframe').contentWindow.location.href = this.get('history')[this.get('historyCursor')];
        this.set('pushToHistory', false);
      }
    }
  }

});