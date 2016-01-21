import Ember from 'ember';
import XCell from '../x-cell/component';
/* global $ */

export default XCell.extend({
    
   classNames: ["header"],
   
   didInsertElement() {
   
       this.$()
            .mouseenter( () => this.sendAction("mouse-enter", this.get('cell'), this) )
            .mouseleave( () => this.sendAction("mouse-leave", this.get('cell'), this) );
            
       this.$(".resize-handle").mousedown( (e) => {
           this.sendAction("start-resize", this.get('cell'), this)
           e.preventDefault();
       });
        
   }
    
});