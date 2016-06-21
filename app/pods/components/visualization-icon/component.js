import Ember from 'ember';
import config from 'mapp/config/environment';

export default Ember.Component.extend({
  
  tagName: "img",
  attributeBindings: ["src"],
  
  type: null,
  
  src: function() {
    if (this.get('type')) {
      return config.rootURL+"assets/images/viz/small-"+this.get('type').replace(/\./, "-")+".jpg";
    } else {
      return config.rootURL+"assets/images/unknow.jpg";
    } 
  }.property('type')
  
});
