import Ember from 'ember';
/* global $ */

export default Ember.Component.extend({
  
  tagName: "ul",
  
  value: 0,
  
  stars: function() {
    let arr = Em.A();
    for (let i = 0; i < this.get('value'); i++) {
      arr.push(true);
    }
    return arr;
  }.property('value')


});
