import Ember from 'ember';

export default Ember.Component.extend({

  fileReaderComponent: null,

  didInsertElement() {
    let el = this.$().get(0);
    el.addEventListener("dragover", this.fileDragHover.bind(this));
		el.addEventListener("dragleave", this.fileDragHover.bind(this));
    el.addEventListener("drop", this.fileDropHandler.bind(this));
  },

  fileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    this.$().toggleClass("dragover", e.type == "dragover");
  },

  fileDropHandler(e) {
    this.fileDragHover(e);
    let files = e.target.files || e.dataTransfer.files;
    this.get('fileReaderComponent').read(files);
  },

  actions: {
      
      onFileReaderReady: function(c) {
          this.set('fileReaderComponent', c);
      },
      
      onread: function(text) {
          this.sendAction('onContentLoaded', text);
      }
      
  }

});
