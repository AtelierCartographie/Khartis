import Ember from 'ember';

var GrowlService = Ember.Service.extend({

	target: null,

	connect: function(target) {
		this.set('target', target);
	},
	
	disconnect: function(modal) {
		this.set('target', null);
	},
	
	notify: function(message, level) {
    if (this.get('target')) {
		  this.get('target').addMessage(message, level);
    }
	}

});

export default GrowlService;
