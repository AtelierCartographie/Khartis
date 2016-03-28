import Ember from 'ember';

export default Ember.Component.extend({
  
  tagName: "img",
  attributeBindings: ["src"],
  
  type: null,
  
  src: function() {
    if (this.get('type')) {
      return "assets/images/viz/small-"+this.get('type').replace(/\./, "-")+".jpg";
    } else {
      return "assets/images/unknow.jpg";
    } 
  }.property('type')
  
});
