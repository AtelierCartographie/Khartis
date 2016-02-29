import Ember from 'ember';

export default Ember.Component.extend({
    
    tagName: "div",
    
    classNames: ["cell"],
    
    cell: null,
    
    backupValue: null,
    
    didInsertElement() {
      
      this.$().attr("tabindex", 1);
      
      this.$().on("keydown", (e) => {
          
          if (e.keyCode === 9) { //tab
              this.cycleSelection(e.shiftKey ? -1:1);
              e.preventDefault();
          }
          
          if (!this.get('cell.state.sheet.edited')) {
              switch (e.keyCode) {
                  case 8:
                      e.preventDefault();
                      break;
                  case 37:
                      this.moveSelection(0,-1);
                      e.preventDefault();
                      break;
                  case 38:
                      this.moveSelection(-1,0);
                      e.preventDefault();
                      break;
                  case 39:
                      this.moveSelection(0,1);
                      e.preventDefault();
                      break;
                  case 40:
                      this.moveSelection(1,0);
                      e.preventDefault();
                      break;
              }
          }
          
      });
      
      this.$().on("keyup", (e) => {
          
          if (e.keyCode === 13) { //enter
              this.startEdition();
          } else if (e.keyCode === 27) { //esc
              if (!this.get('cell.state.sheet.edited')) {
                  this.endSelection();
              }
          }
          
          if (!this.get('cell.state.sheet.edited')) {
              
              if (e.keyCode === 8) { //backspace
                  this.startEdition();
                  this.set('cell.value', "");
                  e.preventDefault();
              }
              
              e.stopImmediatePropagation();
          }
      });
        
    },
    
    toggleEditedState: function() {
      this.$().toggleClass('edited', this.get('cell.state.sheet.edited'));
      
      if (this.get('cell.state.sheet.edited')) {
          this.set('backupValue', this.get('cell.value'));
          Ember.run.later(this, () => {
            this.$('input').focus().select();
          }, 100);
      }
    }.observes('cell.state.sheet.edited'),
    
    toggleSelectedState: function() {
      if (!this.$().hasClass('selected') && this.get('cell.state.sheet.selected')) {
          this.$().focus();
      } else if (this.$().hasClass('selected') && !this.get('cell.state.sheet.selected')) {
          this.$().blur();
      }
      this.$().toggleClass('selected', this.get('cell.state.sheet.selected'));
    }.observes('cell.state.sheet.selected'),
    
    toggleResizingState: function() {
      this.$().toggleClass('resizing', this.get('cell.state.sheet.resizing'));
    }.observes('cell.state.sheet.resizing'),
    
    click(e) {
      this.startSelection();
      e.stopImmediatePropagation();
    },
    
    doubleClick(e) {
      if (this.get('cell.state.sheet.edited')) {
        this.commitEdition();
      } else {
        this.startEdition();
      }
      e.stopImmediatePropagation();
    },
    
    layout: function() {
      if (this.get('cell.column.layout.sheet.width')) {
          this.$().outerWidth(this.get('cell.column.layout.sheet.width'));
      }
      if (this.get('cell.column.layout.sheet.height')) {
          this.$().outerHeight(this.get('cell.row.layout.sheet.height'));
      }
    }.observes('cell.column.layout.sheet.width',
      'cell.row.layout.sheet.height').on("didInsertElement"),
    
    startSelection() {
        this.sendAction('select-start', this.get('cell'), this);
    },
    
    endSelection() {
        this.sendAction('select-end', this.get('cell'), this);
    },
    
    moveSelection(row, col) {
        this.sendAction('move-selection', this.get('cell'), row, col, this);
    },
    
    cycleSelection(shift) {
        this.sendAction('cycle-selection', this.get('cell'), shift, this);
    },
    
    startEdition() {
        this.sendAction('edit-start', this.get('cell'), this);
        this.sendAction('select-start', this.get('cell'), this);
    },
    
    cancelEdition() {
        this.set('cell.value', this.get('backupValue'));
        this.sendAction('edit-end', this.get('cell'), this);
        this.$().focus();
    },
    
    commitEdition() {
        this.sendAction('edit-end', this.get('cell'), this);
        this.$().focus();
    },
    
    actions: {
        
        onInputEnter() {
            this.commitEdition();
        },
        
        onInputBlur() {
            if (this.get('cell.state.sheet.edited')) {
                this.sendAction('edit-end', this.get('cell'), this);
            }
        },
        
        onKeyUp(v, e) {
            if (e.keyCode === 27) {//esc
                this.cancelEdition();
            }
        }
        
    }
    
});
