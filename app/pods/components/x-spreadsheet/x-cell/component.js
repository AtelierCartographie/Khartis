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
        this.$().toggleClass('edited', this.get('cell.state.edited'));
        
        if (this.get('cell.state.edited')) {
            this.set('backupValue', this.get('cell.value'));
            this.$('input').focus();
        }
    }.observes('cell.state.edited'),
    
    toggleSelectedState: function() {
        this.$().toggleClass('selected', this.get('cell.state.selected'));
    }.observes('cell.state.selected'),
    
    toggleResizingState: function() {
        this.$().toggleClass('resizing', this.get('cell.state.resizing'));
    }.observes('cell.state.resizing'),
    
    click() {
        this.get('cell.state.selected') ? this.endSelection() : this.startSelection();
    },
    
    doubleClick() {
        this.get('cell.state.edited') ? this.commitEdition() : this.startEdition();
    },
    
    layout: function() {
        if (this.get('cell.column.layout.width')) {
            this.$().outerWidth(this.get('cell.column.layout.width'));
        }
        if (this.get('cell.column.layout.height')) {
            this.$().outerHeight(this.get('cell.row.layout.height'));
        }
    }.observes('cell.column.layout.width', 'cell.row.layout.height'),
    
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
            if (this.get('cell.state.edited')) {
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