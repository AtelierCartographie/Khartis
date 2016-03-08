import Ember from 'ember';


export default Ember.Component.extend({
    
    tagName: "span",
    
    meta: null,
    
    inconsistency: 0,
    
    isValid: function() {
        return this.get('inconsistency') === 0;
    }.property('inconsistency')
    
});
