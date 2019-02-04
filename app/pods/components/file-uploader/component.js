import Ember from 'ember';

export default Ember.Component.extend({

	tagName: "input",

	attributeBindings: ['multiple', 'type', 'accept'],
	classNames: ["file-uploader"],

	multiple: undefined,
	type: 'file',

  didInsertElement() {

    var self = this;
    this.$().on("change", function() {
      self.sendAction('onchange', this.files, self.reset.bind(self));
    });

    this.$().on("click", (e) => e.stopImmediatePropagation() );

    this.sendAction('onready', this);

  },

  reset() {
    this.$().val("");
  },

  actions: {

      trigger: function() {
          this.$().click();
      }

  }

});
