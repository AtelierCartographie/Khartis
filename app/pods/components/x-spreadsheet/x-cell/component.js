import Ember from 'ember';
/*global Em*/
/* global $ */

export default Ember.Component.extend({
    
    tagName: "div",
    classNames: ["cell"],
    
    cell: null,
    
    backupValue: null,
    
    didInsertElement() {
        this.layout();
    },
    
    toggleEditedState: function() {
        this.$().toggleClass('edited', this.get('cell.state.sheet.edited'));
        
        if (this.get('cell.state.sheet.edited')) {
            this.set('backupValue', this.get('cell.value'));
            this.$('input').focus().select();
        }
    }.observes('cell.state.sheet.edited'),
    
    toggleSelectedState: function() {
        this.$().toggleClass('selected', this.get('cell.state.sheet.selected'));
    }.observes('cell.state.sheet.selected'),
    
    toggleResizingState: function() {
        this.$().toggleClass('resizing', this.get('cell.state.sheet.resizing'));
    }.observes('cell.state.sheet.resizing'),
    
    click(e) {
        this.get('cell.state.sheet.selected') ? this.endSelection() : this.startSelection();
        e.stopImmediatePropagation();
    },
    
    doubleClick(e) {
        this.get('cell.state.sheet.edited') ? this.commitEdition() : this.startEdition();
        e.stopImmediatePropagation();
    },
    
    layout: function() {
        if (this.get('cell.column.layout.sheet.width')) {
            this.$().outerWidth(this.get('cell.column.layout.sheet.width'));
        }
        if (this.get('cell.column.layout.sheet.height')) {
            this.$().outerHeight(this.get('cell.row.layout.sheet.height'));
        }
    }.observes('cell.column.layout.sheet.width', 'cell.row.layout.sheet.height'),
    
    startSelection() {
        this.sendAction('select-start', this.get('cell'), this);
    },
    
    endSelection() {
        this.sendAction('select-end', this.get('cell'), this);
    },
    
    startEdition() {
        this.sendAction('edit-start', this.get('cell'), this);
        this.sendAction('select-start', this.get('cell'), this);
    },
    
    cancelEdition() {
        this.set('cell.value', this.get('backupValue'));
        this.sendAction('edit-end', this.get('cell'), this);
    },
    
    commitEdition() {
        this.sendAction('edit-end', this.get('cell'), this);
    },
    
    actions: {
        
        onInputEnter() {
            this.sendAction('edit-end', this.get('cell'), this);
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