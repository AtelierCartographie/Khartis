import Ember from 'ember';

export default Ember.Component.extend({
  
  value: null,
  max: null,
  
  draw: function() {
    this.doLayout();
  }.on("didInsertElement"),
  
  doLayout: function() {
    if (this.get('max')) {
      let ratio = this.get('value') / this.get('max');
      this.$(".bar").css({width: `${ratio*100}%`});
    } else {
      this.$(".bar").width(0);
    }
  }.observes('value', 'max')
  
  
});
