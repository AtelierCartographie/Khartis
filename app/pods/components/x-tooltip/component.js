import Ember from 'ember';
import snap from 'mapp/utils/snap';
/* global $ */

export default Ember.Component.extend({

  tagName: "div",
  classNames: ['tooltip', 'popable'],
  classNameBindings: ['positionClasses'],
  parent: null,
  position: 'bottom center',
  offset: 5,
  snapped: null,

  positionClasses: function () {
    return this.get('position')
  }.property('position'),

  didInsertElement: function () {

    const el = this.$()
    const parent = this.parent = el.parent();

    const show = this.show.bind(this);
    const hide = this.hide.bind(this);

    var snapped = snap(el[0], 'top center')
      .to(parent[0], this.get('position'))

    this.set('snapped', snapped)

    el.appendTo($(document.body))
    parent.hover(show, hide)
  },

  show(){
    this.$().addClass('visible')
  },

  hide(){
    this.$().removeClass('visible')
  }

});
