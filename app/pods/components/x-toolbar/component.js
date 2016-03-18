import Ember from 'ember';
/* global $ */

export default Ember.Component.extend({
  tagName: "div",
  classNames:['toolbar'],
  triggerEl:null,

  didInsertElement(){
    var trigger = this.$('.toolbar-trigger')
    this.set('triggerEl', trigger)

    this.toggle = this.toggle.bind(this)

    trigger.on('click', this.toggle)
  },

  toggle(){
    this.$().toggleClass('open')
  },

  willDestroyElement(){
    if (this.get('triggerEl')) {
      this.get('triggerEl').off('click', this.toggle)
    }
  }

});
