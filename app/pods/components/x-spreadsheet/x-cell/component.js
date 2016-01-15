import Ember from 'ember';
/*global Em*/
/* global $ */

export default Ember.Component.extend({
    
    tagName: "td",
    
    value: '',
    
    editedCell: null,
    edited: function() {
        return this.get('editedCell') == this;
    }.property('editedCell'),
    
    toggleEdited: function() {
        this.$().toggleClass('edited', this.get('edited'));
        this.$('input').focus();
    }.observes('edited'),
    
    doubleClick() {
        this.sendAction(this.get('edited') ? 'endEdit':'startEdit', this);
    },
    
    actions: {
        
        onInputEnter() {
            this.sendAction('endEdit', this);
        },
        
        onInputBlur() {
            if (this.get('edited')) {
                this.sendAction('endEdit', this);
            }
        }
        
    }
    
});