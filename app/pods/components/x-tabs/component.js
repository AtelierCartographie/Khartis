import Ember from 'ember';
/* global $ */
/* global Em */


export default Ember.Component.extend({

  tagName: 'div',
  activeItem: null,
  
  init() {
    this._super();
    this.set('activeItem', null);
  },
  
  didInsertElement: function () {

    // Handle initial active item
    let $activeItems = this.$('.tab-pane').filter('.active');
    
    this.set('activeItem', $activeItems.get(0));
    
    this.$().on('click', '.tabs li', (e) => {
      let prevActiveItem = this.get('activeItem'),
          newActiveItem = $("#" + ($(e.target).attr('tab-id') || $(e.target).parent('[tab-id]').attr('tab-id')));

      this.set('activeItem', newActiveItem.get(0));
      
    });
    
    this.activeItemChange();
    
  },
  
  activeItemChange: function() {
    
    let activeItem = this.get('activeItem');
    
    this.$('.tab-pane').each( (i, el) => {
      $(el).toggleClass("active", activeItem && el == activeItem);
    });
    
    this.$('.tabs li').each( (i, el) => {
      let $el = $(el);
      $el.toggleClass("active", activeItem && $el.attr("tab-id") === activeItem.id);
    });

    this.sendAction("onActiveItemChange", activeItem.id);
    
  }.observes('activeItem')
  

});
