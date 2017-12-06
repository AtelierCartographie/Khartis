import Ember from 'ember';

export default Ember.Component.extend({

	tagName: "input",

	attributeBindings: ['multiple', 'type', 'accept'],
	classNames: ["file-uplpader"],

	multiple: false,
	type: 'file',

  didInsertElement() {

    var self = this;
    console.log("hello");
    this.$().on("change", function() {
      console.log("hello2");
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
