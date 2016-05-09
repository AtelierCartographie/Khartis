import Ember from 'ember';

var XModal = Ember.Component.extend({

  tagName: "div",

  layoutName: "components/x-modal",

  classNames: ["modal", "fade"],

  onShow: null,
  onHide: null,

  preventBackdropClick: false,
  name: null,

  autoShow: false,

  visible: false,

  large: false,

  didInsertElement: function () {
    console.log('connection')
    this.get('ModalManager').connect(this);

    this.$().on('hidden.bs.modal', e => {

      this.set('visible', false);
      this.sendAction('onHide');

    });

    this.$().on('show.bs.modal', e => {

      this.set('visible', true);

    });

    if (this.get('autoShow')) {

      this.show();

    }

  },

  willDestroyElement: function () {

    this.get('ModalManager').disconnect(this);
    this.hide();

  },

  hide: function () {
    this.$().modal('hide');
    $(".modal-backdrop").hide();
    return this;
  },


  show: function () {

    this.$().modal({
      backdrop: this.get('preventBackdropClick') ? 'static' : true
    });
    this.$().css("z-index", parseInt($(".modal-backdrop").css("z-index")) + 1);
    this.sendAction.apply(this, ['onShow'].concat(Array.prototype.slice.call(arguments)));

    return this;

  }


});

export default XModal;
