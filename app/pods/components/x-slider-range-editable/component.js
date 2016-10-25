import Ember from 'ember';


const IDENTITY = function(val) {
  return val;
}
IDENTITY.invert = function(val) {
  return val;
}

export default Ember.Component.extend({
  
  value:[0,0],
  min:0,
  max:10,
  band: null,
  bandAuto: false,

  inputPosition: "bottom",
  inputNoFill: false,

  inputValueL: null,
  inputValueR: null,
  
  tickAppend: null,
  
  transform: IDENTITY,

  valueChange: function() {
    this.set('inputValueL', this.get('value')[0]);
    this.set('inputValueR', this.get('value')[1]);
  }.observes('value', 'value.[]').on("init"),

  valueCommit(val, ori) {

    let newVal = val.replace(/[^\d\-\.]+/g, "");
      
    if (!isNaN(parseFloat(newVal))) {
      if (ori === "L") {
        this.set('value', [newVal, this.get('value')[1]]);
      } else {
        this.set('value', [this.get('value')[0], newVal]);
      }
    }

  },
  
  actions: {
    
    inputFocusOut(ori, val) {
      this.valueCommit(val, ori);
    },

    inputKeyUp(ori, val, e) {
      if (e.keyCode == 13) {
        this.valueCommit(val, ori);
      }
    }
    
  }
  
});
