import Ember from 'ember';
import XModal from 'khartis/pods/components/x-modal/component';

var ConfirmDialog = XModal.extend({

  layoutName: "components/confirm-dialog",

  classNames: ["modal", "fade", "confirm"],
  additionnalClass: null,

  title: null,
  message: null,
  acceptLabel: null,
  rejectLabel: null,
  cancelLabel: null,

  autoShow: Ember.computed('', {

    get(key) { return false },
    set(key, val) { throw "no sense"; }

  }),

  _promise: null,

  didInsertElement: function() {
    this.get('ModalManager').connect(this);
    this.$().on('hidden.bs.modal', e => {
      this.sendAction('reject');
    });
  },

  show: function(message, title="Confirmation", acceptLabel="Accepter", rejectLabel="Annuler", cancelLabel=null, additionnalClass=null) {
    
    this.setProperties({
      message,
      title,
      acceptLabel,
      rejectLabel,
      cancelLabel,
      additionnalClass
    });

    this.$().modal({
      backdrop: 'static'
    });

    this.$().css("z-index", parseInt($(".modal-backdrop").css("z-index"))+1);

    var promise = new Ember.RSVP.Promise( (resolve, reject) => {

      this.set('_promise', {resolve: (...params) => resolve.apply(this, params), reject: () => reject()});

    });

    return promise;

  },

  actions: {

    accept: function() {

      this.hide();
      this.get('_promise').resolve();

    },

    reject: function() {

      this.hide();
      this.get('_promise').reject();

    },

    cancel: function() {

      this.hide();

    }

  }


});

export default ConfirmDialog;
