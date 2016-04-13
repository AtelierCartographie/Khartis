import Ember from 'ember';

export default Ember.Component.extend({
  
  value: null,
  shapes: null,
  color: null,
  
  actions: {
    
    bindValue(shape) {
      this.set('value', shape);
    }
    
  }
  
});
