import Ember from 'ember';
import d3 from 'd3';

export default Ember.Component.extend({

  tagName: "ul",
  classNames: ["collection", "drag-sort"],
  
  provider: null,
  
  onInsert: function() {
    
    this.attachDrag();
    
  }.on("didInsertElement"),
  
  attachDrag: function() {
    
    Ember.run.later(this, () => {
      
      let self = this,
          $this = this.$(),
          drag = d3.behavior.drag(),
          shiftOveredEl = function(y) {
            
            let pos = {index: undefined},
                siblings = $(this).siblings(),
                overed = siblings.filter( (i, el) => {
                  return (i === 0 || y >= $(el).position().top)
                    && (i === siblings.length-1 || y < $(el).position().top + $(el).outerHeight(true));
                });
            
            if (!overed.length) {
              overed = $(this).next();
            }
            
            overed.each( (i, el) => {
              let shift = (y < $(el).position().top + $(el).outerHeight() / 2) ? 0 : 1,
                  marginTop = shift === 0 ? $(this).outerHeight() : 0,
                  marginBottom = shift === 1 ? $(this).outerHeight() : 0;
              $(el).css({
               "margin-top": marginTop,
               "margin-bottom": marginBottom
              });
              pos = {index: siblings.index(el)+shift};
            });
            
            siblings.not(overed).css({
              "margin-top": 0,
              "margin-bottom": 0
            });
            
            return pos;
          };
    
      drag.origin(function() {
        return {x: $(this).position().left, y: $(this).position().top};
      });
      
      drag.on("dragstart", function() {
        if (!$(d3.event.sourceEvent.target).parents(".no-drag").length) {
          d3.event.sourceEvent.stopPropagation();
          d3.select(this).classed("dragged", true);
          shiftOveredEl.call(this, $(this).position().top);
        }
      });
      
      drag.on("drag", function() {
        if (!$(this).hasClass('dragged')) return;
        
        shiftOveredEl.call(this, d3.event.y);
        
        $(this).css({
           "top": d3.event.y
        });
      });
      
      drag.on("dragend", function() {
        if (!$(this).hasClass('dragged')) return;
        let {index} = shiftOveredEl.call(this, $(this).position().top),
            cur = $(this).index(),
            o = self.get('provider').objectAt(cur);
            
        if (index !== undefined && cur !== index) {
          self.get('provider').replace(index, 0, self.get('provider').splice(cur, 1)[0]);
        }
        
        d3.select(this).classed("dragged", false);
        
        $(this).siblings().css({
          "margin-top": 0,
          "margin-bottom": 0
        });
        
      });
      
      this.d3l().selectAll("li")
        .call(drag);
      
    });
    
  }.observes('provider.[]')
  
  
});
