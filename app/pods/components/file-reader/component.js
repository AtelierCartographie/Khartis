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
          
          //on décode une première fois en iso8859-1
          let buf = this.skipBom(new Uint8Array(e.target.result)),
              s = new TextEncoding.TextDecoder("UTF-8").decode(buf);
              
          let err = this.detectCharsetProblem(s);
          
          //et on réencode si besoin
          if (err > 0) {
            s = new TextEncoding.TextDecoder("iso8859-1").decode(buf);
          }
          
          this.sendAction('onread', s);
          
        }
        
      };
          
      this.sendAction('onready', this);
		
  	},
	
    read: function(files) {
      this.get('fReader').readAsArrayBuffer(files[0]);
    },
    
    detectCharsetProblem(s) {
      
      for (var i = 0, err = 0; i < s.length; i++) {
        let c = s.charCodeAt(i);
        if ( c === 65533 ) {
          err++;
        }
      }
      
      return err;
    
    },
    
    skipBom(buf) {
      // If we have a BOM skip it
      if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
        return buf.subarray(3);
      }
      return buf;
    },
    
    actions: {
        
        trigger: function() {
            this.$().click();
        }
        
    }

});
