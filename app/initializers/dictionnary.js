export default {
  name: 'Dictionnary',

  initialize: function(app) {
    app.inject('model', 'Dictionnary', 'service:dictionnary');
    app.inject('controller', 'Dictionnary', 'service:dictionnary');
    app.inject('component', 'Dictionnary', 'service:dictionnary');
    app.inject('route', 'Dictionnary', 'service:dictionnary');
  }
};
