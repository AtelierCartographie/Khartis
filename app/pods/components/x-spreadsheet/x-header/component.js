import Ember from 'ember';
/* global $ */

export default Ember.Component.extend({
    
   tagName: "th",
    
   content: "",
   
   refEl: null,
   
   widthChange: function() {
       this.$().width($(this.get('refEl')).outerWidth());   
   }.observes('refEl'),
   
   didInsertElement() {
   
       this.$()
        .mouseenter( () => this.sendAction("onMouseEnter", this) )
        .mouseleave( () => this.sendAction("onMouseLeave", this) );
        
        
        this.widthChange();
        
   },
   
   resizeTo(left) {
       let w = left - this.$().position().left;
       this.$().width(w);
       $(this.get('refEl')).width(w);
   }
    
});