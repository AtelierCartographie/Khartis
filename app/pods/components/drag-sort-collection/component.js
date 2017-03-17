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

        shiftOveredEl.call(this, d3.event.y);
        
        $(this).css({
           "top": d3.event.y
        });
      });
      
      drag.on("end", function(d, i) {

        if (!self.get('wasDragged') && !$(d3.event.sourceEvent.target).parents(".no-drag-click").length) {
          self.sendAction('onClick', i);
        }

        let {index} = shiftOveredEl.call(this, $(this).position().top),
            cur = $(this).index(),
            o = self.get('provider').objectAt(cur);
            
        if (index !== undefined && cur !== index) {
          self.get('provider').replace(index, 0, self.get('provider').splice(cur, 1)[0]);
        }
        
        d3.select(this).classed("dragged", false);
        d3.select(this).classed("will-drag", false);

          $(this).siblings().css({
            "margin-top": "",
            "margin-bottom": ""
          });

      });
      
      this.d3l().selectAll("li")
        .call(drag);
      
    });
    
  }.observes('provider.[]')
  
  
});
