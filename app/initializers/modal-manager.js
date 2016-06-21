export default {
  name: 'x-modal-manager',

  initialize: function(application) {
    application.inject('model', 'ModalManager', 'service:modal-manager');
    application.inject('controller', 'ModalManager', 'service:modal-manager');
    application.inject('component', 'ModalManager', 'service:modal-manager');
    application.inject('route', 'ModalManager', 'service:modal-manager');
  }
};
