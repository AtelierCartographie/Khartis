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
        this.$().toggleClass('edited', this.get('cell.edited'));
        
        if (this.get('cell.edited')) {
            this.set('backupValue', this.get('cell.value'));
            this.$('input').focus();
        }
    }.observes('cell.edited'),
    
    doubleClick() {
        this.get('cell.edited') ? this.commitEdition() : this.startEdition();
    },
    
    layout: function() {
        this.$().outerWidth(this.get('cell.layout.width'));
        this.$().outerHeight(this.get('cell.layout.height'));
    }.observes('cell.layout.width', 'cell.layout.height'),
    
    startEdition() {
        this.sendAction('edit-start', this.get('cell'));
    },
    
    cancelEdition() {
        this.set('cell.value', this.get('backupValue'));
        this.sendAction('edit-end', this.get('cell'));
    },
    
    commitEdition() {
        this.sendAction('edit-end', this.get('cell'));
    },
    
    actions: {
        
        onInputEnter() {
            this.sendAction('edit-end', this.get('cell'));
        },
        
        onInputBlur() {
            if (this.get('cell.edited')) {
                this.sendAction('edit-end', this.get('cell'));
            }
        },
        
        onKeyUp(v, e) {
            if (e.keyCode === 27) {//esc
                this.cancelEdition();
            }
        }
        
    }
    
});