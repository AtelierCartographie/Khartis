export default {
  name: 'i18n',

  after: 'ember-i18n',

  initialize: function(app) {
    app.inject('model', 'i18n', 'service:i18n');
    app.inject('controller', 'i18n', 'service:i18n');
    app.inject('component', 'i18n', 'service:i18n');
    app.inject('route', 'i18n', 'service:i18n');
  }
};
