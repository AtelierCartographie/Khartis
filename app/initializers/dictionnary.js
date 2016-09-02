export default {
  name: 'Dictionary',

  initialize: function(app) {
    app.inject('model', 'Dictionary', 'service:dictionary');
    app.inject('controller', 'Dictionary', 'service:dictionary');
    app.inject('component', 'Dictionary', 'service:dictionary');
    app.inject('route', 'Dictionary', 'service:dictionary');
  }
};
