import Ember from 'ember';
/* global $ */

export default Ember.Component.extend({
  
  tagName: "ul",
  
  value: 0,
  max: null,
  
  clampLeft: 0,
  
  iconFalse: null,
  iconTrue: "iconfont-star",
  
  stars: function() {
    let arr = Em.A(),
        max = (this.get('max')+this.get('clampLeft')) || this.get('value');
    for (let i = this.get('clampLeft') + 1; i <= max; i++) {
      console.log(i, this.get('value'));
      arr.push(i <= this.get('value'));
    }
    return arr;
  }.property('value')


});
