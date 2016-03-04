import Ember from 'ember';


export default Ember.Component.extend({
    
    tagName: "span",
    
    meta: null,
    isValid: function() {
        return this.get('meta.probability') > 0.7;
    }.property('meta.probability')
    
});
