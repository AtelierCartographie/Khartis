// TODO: DropDown Ember position param
// TODO: Close dropdown on action click
// TODO: Close on window click when opened

import Ember from 'ember';
import snap, {forceUpdate} from 'mapp/utils/snap';

/* global $ */

export default Ember.Component.extend({

  tagName: "",
  triggerEl: null,
  targetEl: null,
  snapped:null,
  open: false,

  didInsertElement: function () {

    const trigger = this.$().next('.dropdown-trigger')
    const dropdown = trigger.next('.dropdown')
    this.set('triggerEl', trigger)
    this.set('targetEl', dropdown)

    const toggle = this.toggle.bind(this)

    snap(dropdown[0], 'top right').to(trigger[0], 'bottom right')
    trigger.on('click', toggle)

  },

  toggle(){
    var isOpen = this.get('open')
    isOpen ? this.hide() : this.show()
    this.toggleProperty('open')

  },

  show(){
    this.get('targetEl').addClass('visible')
    this.get('triggerEl').addClass('active')
  },

  hide(){
    this.get('targetEl').removeClass('visible')
    this.get('triggerEl').removeClass('active')

  },

  '$': function () {
    return $("#" + this.elementId);
  }

});
