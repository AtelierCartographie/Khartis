import Ember from 'ember';
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
          
      this.get('fReader').onload = (e) => {
        this.sendAction('onread', e.target.result);
      };
          
      this.sendAction('onready', this);
		
  	},
	
    read: function(files) {
      this.get('fReader').readAsText(files[0]);
    },
    
    actions: {
        
        trigger: function() {
            this.$().click();
        }
        
    }

});
