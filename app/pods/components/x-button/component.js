import Ember from 'ember';


export default Ember.Component.extend({
    
    classNames: ["button"],
  
    label: "",
    disabled: false,
    invisible: false,
    
    disabledChange: function() {
      this.$().toggleClass("disabled", this.get('disabled'));
    }.observes('disabled').on("didInsertElement"),
    
    invisibleChange: function() {
      this.$().toggleClass("invisible", this.get('invisible'));
    }.observes('invisible').on("didInsertElement"),
    
    click() {
      if (!this.get('disabled')) {
        this.sendAction();
      }
    }
  
});
