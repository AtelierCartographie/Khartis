import Ember from 'ember';

export default Ember.TextField.extend({

	type: 'minicolors',
	attributeBindings: ['name'],
	classNames: ["panel-input"],
	didInsertElement: function() {
		this.$().minicolors({
            animationSpeed: 10,
            animationEasing: 'swing',
            change: null,
            changeDelay: 100,
            control: 'hue',
            dataUris: true,
            defaultValue: '',
            hide: null,
            hideSpeed: 0,
            inline: false,
            letterCase: 'lowercase',
            opacity: false,
            position: 'bottom left',
            show: null,
            showSpeed: 0,
            theme: 'default'
        });
	}

});

