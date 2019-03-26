import Ember from 'ember';
import config from 'khartis/config/environment';

export default Ember.Component.extend({

  classNames: ['documentation-popover'],
  classNameBindings: ['expanded'],

  documentationService: Ember.inject.service('documentation'),

  expanded: false,
  history: null,
  historyCursor: -1,
  iframe: null,
  pushToHistory: true,
  sourceUrl: `${config.rootURL}documentation/site/index.html`,

  init() {
    this._super();
    this.set('history', Em.A([]));
    this.get('documentationService').on("openAtUrl", url => this.openAtUrl(url));
  },

  canGoBack: function() {
    return this.get('history').length > 1 && this.get('historyCursor') > 0;
  }.property('history.[]', 'historyCursor'),

  canGoForward: function() {
    return this.get('historyCursor') < this.get('history').length - 1;
  }.property('history.[]', 'historyCursor'),

  openAtUrl(url) {
    this.set('expanded', true);
    this.set('sourceUrl', `${config.rootURL}documentation/site/${url}`);
  },

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
