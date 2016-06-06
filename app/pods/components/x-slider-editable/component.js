import Ember from 'ember';


const IDENTITY = function(val) {
  return val;
}
IDENTITY.invert = function(val) {
  return val;
}

export default Ember.Component.extend({
  
  value:0,
  min:0,
  max:10,
  band: null,
  
  inputValue: null,
  
  tickAppend: null,
  
  transform: IDENTITY,
  
  valueChange: function() {
    this.set('inputValue', this.get('value'));
  }.observes('value').on("init"),
  
  actions: {
    
    inputFocusOut(val) {
      
      let newVal = val.replace(/[^\d\-\.]+/g, "");
      
      if (!isNaN(parseFloat(newVal))) {
        this.set('value', newVal);
      }
      
    }
    
  }
  
});
