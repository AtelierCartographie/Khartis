import Ember from 'ember';
/* global $ */
/* global Em */


export default Ember.Component.extend({

  tagName: 'div',
  classNames: ['accordion'],
  activeItems: null,
  maxOpened: 2,
  autoLayout: true,
  
  resizeInterval: null,
  
  init() {
    this._super();
    this.set('activeItems', Em.A());
  },
  
  cleanup: function() {
    clearInterval(this.get('resizeInterval'));
  }.on("willDestroyElement"),

  didInsertElement: function () {

    // Handle initial active item
    let activeItems = this.$('.accordion-item').filter('.active');
    
    this.get('activeItems').addObjects($.makeArray(activeItems));
    
    // HANDLE RESIZE
    let $size = () => {
      this.postResize();
    };
    this.set('resizeInterval', setInterval($size, 600));
    $size();
    // ---------

    // Click event on triggers (delegation)
    this.$().on('click', '.accordion-trigger', (e) => {

      let prevActiveItems = this.get('activeItems'),
          newActiveItem = $(e.target).parent().get(0);

      if (prevActiveItems.indexOf(newActiveItem) !== -1) {
        prevActiveItems.removeObject(newActiveItem);
      } else {
        prevActiveItems.addObject(newActiveItem);
      }
      
    });
    
    this.activeItemsChange();
    
  },
  
  activeItemsChange: function() {
    
    let $items = this.$('.accordion-item');
    
    this.get('activeItems').splice(0, this.get('activeItems').length - this.get('maxOpened'));
    
    $.makeArray($items).forEach( (item) => {
      if (this.get('activeItems').indexOf(item) === -1) {
        $(item).removeClass("active")
          .children('.accordion-wrapper')
          .css('height', 0);
      } else {
        $(item).addClass("active")
          .children('.accordion-wrapper')
          .css('height', 'auto');
      }
      
    });
    
    Ember.run.later(this, this.postResize, 100);
    
  }.observes('activeItems.[]'),
  
  postResize: function() {
    
    if (this.get('autoLayout')) {
      
      let $items = this.$('.accordion-item'),
          totalHeight = $.makeArray($items).reduce( (r, v) => {
            return r + $(v).height();
          }, 0);
          
      let subset = this.get('activeItems').filter( (item, i, arr) => {
        if (totalHeight > this.$().height() && i < arr.length - 1) {
          totalHeight -= $(item).height();
          return false;
        }
        return true;
      });
      
      if (this.get('activeItems').length > subset.length) {
        this.set('activeItems', subset);
      }
      
    }
    
  }


});
