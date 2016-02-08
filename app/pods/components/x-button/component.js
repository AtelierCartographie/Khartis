import Ember from 'ember';


export default Ember.Component.extend({
    
    classNames: ["button"],
  
    label: "",
    disabled: false,
    
    disabledChange: function() {
      this.$().toggleClass("disabled", this.get('disabled'));
    }.observes('disabled').on("didInsertElement"),
    
    click() {
      if (!this.get('disabled')) {
        this.sendAction();
      }
    }
  
});
