import Ember from 'ember';

export default Ember.Component.extend({
    
    label: "Choisir un fichier",
    handler: "reader", //ou uploader
    accept: "*",
    multiple: undefined,
    
    fileReaderComponent: null,
    
    click() {
      this.get('fileReaderComponent').send('trigger');
    },

    didInsertElement() {
      this.$().on("dragover", (e) => {
        e.preventDefault();  
        e.stopPropagation();
        this.$().addClass('dragging');
      });

      this.$().on("dragleave", (e) => {
        e.preventDefault();  
        e.stopPropagation();
        this.$().removeClass('dragging');
      });
    
      this.$().on("drop", e => {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.$().removeClass('dragging');
        console.log(e.dataTransfer.items);
        this.send("onchange", Array.prototype.slice.apply(e.dataTransfer.items).map(i => i.getAsFile()), () => void 0);
      });
    },
    
    actions: {
        
      onFileReaderReady: function(c) {
        this.set('fileReaderComponent', c);
      },
      
      onread: function(text) {
        this.sendAction('onContentLoaded', text);
      },

      onchange: function(files, resetFn) {
        this.sendAction('onFileSelected', files, resetFn);
      }
        
    }
});
