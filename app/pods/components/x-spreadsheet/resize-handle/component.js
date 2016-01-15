import Ember from 'ember';
/* global $ */

export default Ember.Component.extend({
    
    tagName: "div",
    
    classNames: ["resize-handle"],
    
    headerComponent: null,
    
    dragging: false,
    onDraggingChange: function() {
        
        if (this.get('dragging')) {
            
            this.$().parents()
                .on('mousemove', this.handleMouseMove.bind(this))
                .on('mouseup', this.stopDragging.bind(this));
            
        } else {
            this.$().parents().off('mousemove');
        }
        
    }.observes('dragging'),
    
    didInsertElement() {
        
        this.$().on('mousedown', (e) => {
            this.set('dragging', true);
            e.preventDefault();
        }).on('mouseup', this.stopDragging.bind(this));
        
        this.sendAction("ready", this);
        
    },
    
    handleMouseMove(e) {
        this.$().offset({
            left: e.pageX - this.$().outerWidth() / 2
        });
    },
    
    stopDragging() {
        this.get('headerComponent').resizeTo(this.$().position().left);
        this.set('dragging', false);
    },
    
    attachToHeader(headerComponent) {
        
        if (!this.get('dragging')) {
            
            this.set('headerComponent', headerComponent);
            
            this.$().not(".draggable").css({
                left: headerComponent.$().position().left + headerComponent.$().outerWidth() - this.$().width(),
                display: "block"
            });
        }
        
    },
    
    detachFromHeader(headerComponent) {
        
        if (!this.get('dragging')) {
            this.set('headerComponent', null);
            this.$().css({display: "none"});
        }
        
    }
    
});