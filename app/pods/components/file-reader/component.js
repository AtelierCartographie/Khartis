import Ember from 'ember';
import ab2string from 'mapp/utils/ab2string';
/* global $ */

export default Ember.Component.extend({
	
	tagName: "input",
	
	attributeBindings: ['multiple', 'type'],
	classNames: ["file-reader"],
	
	multiple: false,
	type: 'file',
	
	fReader: null,
  
  	didInsertElement() {
          
      var self = this;
    
      this.set('fReader', new FileReader());
      
      this.$().on("change", function() {
        self.read(this.files);
      });
      
      this.$().on("click", (e) => e.stopImmediatePropagation() );
          
      this.get('fReader').onload = (e) => {
        
        if (e.target.result instanceof ArrayBuffer) {
          
          this.sendAction('onread', ab2string(e.target.result));
          
        }
        
      };
          
      this.sendAction('onready', this);
		
  	},
	
    read: function(files) {
      this.get('fReader').readAsArrayBuffer(files[0]);
    },
    
    actions: {
        
        trigger: function() {
            this.$().click();
        }
        
    }

});
