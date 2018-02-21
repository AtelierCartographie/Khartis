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
      self.sendAction('onchange', this.files);
    });

    this.$().on("click", (e) => e.stopImmediatePropagation() );

    this.sendAction('onready', this);

  },

  actions: {

      trigger: function() {
          this.$().click();
      }

  }

});
