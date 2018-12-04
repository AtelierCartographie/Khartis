import Ember from 'ember';

export default Ember.Component.extend({
    
    label: "Choisir un fichier",
    handler: "reader", //ou uploader
    accept: "*",
    
    fileReaderComponent: null,
    
    click() {
      this.get('fileReaderComponent').send('trigger');
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
