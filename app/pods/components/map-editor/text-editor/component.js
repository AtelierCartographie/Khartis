import Ember from 'ember';
import snap, {forceUpdate} from 'khartis/utils/snap';

const EV_NS = "text-editor";

let TextEditor = Ember.Component.extend({

  uid: null,
  text: null,

  _cb: () => void(0),

  didInsertElement() {
    this.hide();
    TextEditor.instances[this.uid] = this;
  },

  willDestroyElement() {
    $(document).off(`click.${EV_NS}`);
    TextEditor.instances[this.uid] = null;
  },

  hide() {
    $(document).off(`click.${EV_NS}`);
    this.$(".popup-text-editor").css({display: "none"});
  },

  showAt(el, text, cb) {

    this.hide(); //hide first before show

    this.setProperties({
      text: text,
      _cb: cb
    });

    this.$(".popup-text-editor").css({display: "block"});
    this.move(el);

    Ember.run.later(this, () => {
      $(document).on(`click.${EV_NS}`, this.handleOuterClick.bind(this));
    });

  },

  move(el) {

    let triggerLeft = el.getBoundingClientRect().left,
        triggerTop = el.getBoundingClientRect().top,
        triggerW = el.getBoundingClientRect().width,
        triggerH = el.getBoundingClientRect().height,
        offsetV = 10,
        left = triggerLeft + (triggerW - this.$().outerWidth()) / 2,
        top = triggerTop - this.$().outerHeight() - offsetV;

    if (top < 0) {
      top = triggerTop + triggerH + offsetV;
      this.$().toggleClass("placement-bottom", true);
      this.$().toggleClass("placement-top", false);
    } else {
      this.$().toggleClass("placement-bottom", false);
      this.$().addClass("placement-top", true);
    }
    
    if (left + this.$().outerWidth() > $(document.body).width()) {
      let shift = left + this.$().outerWidth() - $(document.body).width();
      left -=  shift;
      this.$(".arrow").css({
        left: this.$().outerWidth() / 2 - 20 + shift/2
      });
    } else {
      this.$(".arrow").css({
        left: this.$().outerWidth() / 2 - 20
      });
    }

    this.$().css({
      left: left,
      top: top
    });

    this.$("textarea").focus();

  },

  handleOuterClick(e) {
    if (!($(e.target).is(this.$(".popup-text-editor")) || $.contains(this.$()[0], e.target))) {
      this.hide();
    }
  },

  actions: {
    textCommit() {
      this.get('_cb')(this.get('text'));
      this.hide();
    },
    unapply() {
      this.get('_cb')(undefined);
      this.hide();
    }
  }

});


TextEditor.reopenClass({
  instances: {},
  showAt(uid, el, text, cb) {
    this.instances[uid].showAt(el, text, cb);
  }
});



export default TextEditor;
