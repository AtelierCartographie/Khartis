import Ember from 'ember';

export default Ember.TextField.extend({

	type: 'text',
  
  showInput: true,
  
  liveRendering: true,
  
	didInsertElement: function() {
		this.$().spectrum({
      showInput: this.get('showInput'),
      preferredFormat: "hex",
      move: (color) => {
        if (this.get('liveRendering')) {
          this.set('value', color.toHexString());
        }
      }
    });
	},
  
  valueChange: function() {
    this.$().spectrum("set", this.get('value'));
  }.observes('value')
  
});

