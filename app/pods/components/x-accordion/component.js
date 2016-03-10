import Ember from 'ember';
/* global $ */


export default Ember.Component.extend({

  tagName: 'div',
  classNames: ['accordion'],
  items: null,
  activeItem: null,

  didInsertElement: function () {

    var items = this.$('.accordion-item')
    this.set('items', items)

    // Handle initial active item
    var activeItem = items.first().addClass('active')
    this.set('activeItem', activeItem)

    // hide non active items
    items.filter(':not(.active)')
      .children('.accordion-wrapper')
      .css('height', 0)

    // Click event on triggers (delegation)
    this.$().on('click', '.accordion-trigger', function (e) {

      var prevActiveItem = this.get('activeItem')
      var newActiveItem = $(e.target).parent()

      if (prevActiveItem === newActiveItem) {
        return
      }

      // remove previous active item
      prevActiveItem.removeClass('active')
        .children('.accordion-wrapper')
        .css('height', 0)

      // Register new active item
      newActiveItem.addClass('active')
        .children('.accordion-wrapper')
        .css('height', 'auto')

      this.set('activeItem', newActiveItem)


    }.bind(this))
  }


});
