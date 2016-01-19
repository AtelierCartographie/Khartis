import Ember from 'ember';
import XCell from '../x-cell/component';
/* global $ */

export default XCell.extend({
    
   classNames: ["header"],
   
   didInsertElement() {
   
       this.$()
            .mouseenter( () => this.sendAction("onMouseEnter", this) )
            .mouseleave( () => this.sendAction("onMouseLeave", this) );
        
   }
    
});