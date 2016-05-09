import Ember from 'ember';

var XModalManager = Ember.Service.extend({

	modals: [],

	connect: function(modal) {

		this.get('modals').addObject(modal);

	},

	disconnect: function(modal) {

		this.get('modals').removeObject(modal);

	},

	show: function(name) {

		var modal = this.get('modals').find(x => x.get('name') == name);

		if (modal) {

			return modal.show.apply(modal, Array.prototype.slice.call(arguments, 1));

		}

		throw `Modal ${name} not found`;

	},

	hide: function(name) {

		var modals = this.get('modals')
            .filter(x => x.get('name') == name)
            .forEach( x => x.hide() );

	}

});

// var Initializer = {
//
//   	name: 'x-modal-manager',
//
//   	initialize: function(container, application) {
//
// 		application.inject('route', 'ModalManager', 'service:modal-manager');
// 		application.inject('controller', 'ModalManager', 'service:modal-manager');
// 		application.inject('component', 'ModalManager', 'service:modal-manager');
// 		application.inject('view', 'ModalManager', 'service:modal-manager');
//
//   	}
//
// };

export default XModalManager;
// export {Initializer};
