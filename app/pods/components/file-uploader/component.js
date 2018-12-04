import Ember from 'ember';

export default Ember.Component.extend({

	tagName: "input",

	attributeBindings: ['multiple', 'type', 'accept'],
	classNames: ["file-uploader"],

	multiple: false,
	type: 'file',

  didInsertElement() {

    var self = this;
    this.$().on("change", function() {
      self.sendAction('onchange', this.files, self.cancel.bind(self));
    });

    this.$().on("click", (e) => e.stopImmediatePropagation() );

    this.sendAction('onready', this);

  },

  cancel() {
    this.$().val("");
  },

  actions: {

      trigger: function() {
          this.$().click();
      }

  }

});
