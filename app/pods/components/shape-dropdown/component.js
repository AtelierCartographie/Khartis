import Ember from 'ember';

export default Ember.Component.extend({
  
  value: null,
  shapes: null,
  color: null,

  transparent: false,

  actions: {
    
    bindValue(shape) {
      this.set('value', shape);
      this.sendAction('update', shape);
    }
    
  }
  
});
