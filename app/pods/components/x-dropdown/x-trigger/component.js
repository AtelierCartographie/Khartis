import Ember from 'ember';
import snap from 'mapp/utils/snap';

/* global $ */


export default Ember.Component.extend({

  tagName: "",
  triggerEl: null,
  targetEl: null,
  open: false,

  didInsertElement: function () {

    const trigger = this.$().next('.dropdown-trigger')
    const dropdown = trigger.next('.dropdown')

    this.set('triggerEl', trigger)
    this.set('targetEl', dropdown)

    const toggle = this.toggle.bind(this)

    snap(dropdown[0], 'top left').to(trigger[0], 'top left')

    trigger.on('click', toggle)
  },

  toggle(){
    var isOpen = this.get('open')
    isOpen ? this.hide() : this.show()
    this.toggleProperty('open')
  },

  show(){
    this.get('targetEl').addClass('visible')
  },

  hide(){
    this.get('targetEl').removeClass('visible')
  },

  '$': function () {
    return $("#" + this.elementId);
  }

});
