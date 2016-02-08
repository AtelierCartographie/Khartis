import Ember from 'ember';
import TextEncoding from 'npm:text-encoding';
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
        
        if (e.target.result instanceof ArrayBuffer) {
          let encoding = this.detectCharset(e.target.result);
          let s = new TextEncoding.TextDecoder(encoding).decode(new Uint8Array(e.target.result));
          this.sendAction('onread', s);
        }
        
      };
          
      this.sendAction('onready', this);
		
  	},
	
    read: function(files) {
      this.get('fReader').readAsArrayBuffer(files[0]);
    },
    
    detectCharset(buf) {
      
      let view = new Uint8Array(buf);
      for (var i = 0; i < view.byteLength; i++) {
        let c = view[i];
        console.log(c);
        if ( (c > 127) && (c < 2048) ) {
          console.log("utf");
          return "UTF-8";
        }
        console.log("iso");
        return "iso8859-1";
      }
      
    },
    
    actions: {
        
        trigger: function() {
            this.$().click();
        }
        
    }

});
