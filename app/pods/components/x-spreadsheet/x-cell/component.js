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
    
    toggleResizingState: function() {
        this.$().toggleClass('resizing', this.get('cell.state.resizing'));
    }.observes('cell.state.resizing'),
    
    doubleClick() {
        this.get('cell.state.edited') ? this.commitEdition() : this.startEdition();
    },
    
    layout: function() {
        this.$().outerWidth(this.get('cell.layout.width'));
        this.$().outerHeight(this.get('cell.layout.height'));
    }.observes('cell.layout.width', 'cell.layout.height'),
    
    startEdition() {
        this.sendAction('edit-start', this.get('cell'), this);
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