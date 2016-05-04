import Ember from 'ember';


export default Ember.Component.extend({
  
  value:0,
  min:0,
  max:10,
  band: null,
  
  inputValue: null,
  
  tickAppend: null,
  
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
