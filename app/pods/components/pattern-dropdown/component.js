import Ember from 'ember';

export default Ember.Component.extend({
  
  value: null,
  patterns: null,
  color: null,
  
  actions: {
    
    bindValue(pattern) {
      this.set('value', pattern);
    }
    
  }
  
});
