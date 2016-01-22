import Ember from 'ember';
import d3 from 'd3';
/* global $ */

export default Ember.Component.extend({
    
    tagName: "div",
    
    classNames: ["resizer"],
    
    target: null,
    
    targetChange: function() {
        if (this.get('target') != null) {
            
            let el = this.d3l(),
                resizer = el.select(".handle");
            
            //fake mousedown    
            var event = document.createEvent('MouseEvent');
            event.initEvent("mousedown",true,true);
            resizer.node().dispatchEvent(event);
            
        }
    }.observes('target'),
    
    didInsertElement() {
        
        let el = this.d3l(),
            resizer = el.select(".handle");

        var dragResize = d3.behavior.drag()
            .on('dragstart', () => {
                el.classed('dragged', true);
                this.set('target.cell.state.resizing', true);
                this.$().offset({
                    left: this.get('target').$().offset().left + this.get('target').$().outerWidth() - this.$().width() + this.$().parent('.sheet').scrollLeft()
                });
            })
            .on('dragend', () => {
                this.commitResize();
                el.classed('dragged', false);
            })
            .on('drag', () => {
                let x = d3.mouse(el.node().parentNode)[0] + this.$().parent('.sheet').scrollLeft(),
                    cellOffset = this.get('target').$().offset().left - this.get('target').$().parent().offset().left; //TODO : corriger le min
                x = Math.max(cellOffset, x);
                el.style('left', x + 'px');
            });
            
        resizer.call(dragResize);
        
    },
    
    commitResize() {
        let width = this.$().offset().left - this.get('target').$().offset().left;
        this.set('target.cell.state.resizing', false);
        this.sendAction('apply-resize', width, this.get('target.cell'));
        this.sendAction('stop-resize', this.get('target'));
    }
    
});