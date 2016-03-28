import Ember from 'ember';


export default Ember.Component.extend({
    
    tagName: "span",
    
    meta: null,
    type: null,
    
    cType: function() {
      return this.get('type') ? this.get('type') : this.get('meta.type');
    }.property('meta.type', 'type'),
    
    inconsistency: 0,
    
    isValid: function() {
        return this.get('inconsistency') === 0;
    }.property('inconsistency')
    
});
