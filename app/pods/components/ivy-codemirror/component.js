import Super from 'ivy-codemirror/components/ivy-codemirror';

export default Super.extend({

  didInsertElement() {
    this._super(...arguments);
    this._codeMirror.on("drop", (cm, e) => {
      e.preventDefault();
      var dt = e.dataTransfer;
      if (dt.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i=0; i < dt.items.length; i++) {
          if (dt.items[i].kind == "file") {
            var f = dt.items[i].getAsFile();
            this.sendAction('fileDrop', f);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i=0; i < dt.files.length; i++) {
          this.sendAction('fileDrop', dt.files[i]);
        }  
      }
      return false;
    });
  }

});
