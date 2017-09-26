import Ember from 'ember';
import d3 from 'npm:d3';
/* global $ */

export default Ember.Component.extend({

  tagName: "ul",
  classNames: ["collection", "drag-sort"],

  provider: null,

  wasDragged: false,
  
  onInsert: function() {
    
    this.attachDrag();
    
  }.on("didInsertElement"),

  attachDrag: function() {

    Ember.run.later(this, () => {
      
      let self = this,
          $this = this.$(),
          drag = d3.drag(),
          insertGhostEl = function() {
            if ($(this).siblings().filter('.ghost').length == 0) {
              $(document.createElement("li"))
                .css({
                  height: $(this).height()
                })
                .attr("class", $(this).attr("class").replace("dragged", ""))
                .toggleClass("ghost", true)
                .html($(this).html())
                .insertAfter($(this));
            }
          },
          toggleOveredClass = function(y) {
            
            let pos = {index: undefined},
                siblings = $(this).siblings(),
                overed = siblings.filter( (i, el) => {
                  return (i === 0 || y+$(this).outerHeight(true)/2 >= $(el).position().top)
                    && (i === siblings.length-1 || y+$(this).outerHeight(true)/2 < $(el).position().top + $(el).outerHeight(true));
                });
            
            if (!overed.length) {
              overed = $(this).next();
            }
            
            overed.each( (i, el) => {
              $(el).toggleClass("overed", true);
              pos = {index: siblings.index(el)};
            });
            
            siblings.not(overed).toggleClass("overed", false);
            
            return pos;
          };

      drag = drag.filter(function() {
        return !$(d3.event.target).hasClass("no-drag") && !$(d3.event.target).parents(".no-drag").length;
      });
    
      drag.subject(function() {
        return {x: $(this).position().left, y: $(this).position().top};
      });
      
      drag.on("start", function() {
        if (!$(d3.event.sourceEvent.target).hasClass("no-drag") && !$(d3.event.sourceEvent.target).parents(".no-drag").length) {
          d3.event.sourceEvent.stopPropagation();
          self.set('wasDragged', false);
        }
      });
      
      drag.on("drag", function() {

        d3.select(this).classed("dragged", true);
        d3.select(this).classed("will-drag", false);
        self.set('wasDragged', true);

        insertGhostEl.call(this);
        toggleOveredClass.call(this, d3.event.y);
        
        $(this).css({
           "top": d3.event.y
        });
      });
      
      drag.on("end", function(d, i) {

        if (!self.get('wasDragged') && !$(d3.event.sourceEvent.target).parents(".no-drag-click").length) {
          self.sendAction('onClick', i);
        }
        
        let {index} = toggleOveredClass.call(this, $(this).position().top),
            cur = $(this).index(),
            o = self.get('provider').objectAt(cur);
        
        d3.select(this).classed("dragged", false);
        d3.select(this).classed("will-drag", false);

        $(this).siblings()
          .toggleClass("overed", false)
          .filter(".ghost").remove();
          
        if (index !== undefined && cur !== index) {
          self.sendAction("swap", cur, index);
        }

      });
      
      this.d3l().selectAll("li")
        .call(drag);
      
    });
    
  }.observes('provider.[]')
  
  
});
