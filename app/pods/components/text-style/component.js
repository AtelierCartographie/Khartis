import Ember from 'ember';

export default Ember.Component.extend({
	model: null,
	minSize: 10,
    maxSize: 18,
    withAnchor: false,

	fontSizes: null,

    fontList: [ 'Arial', 'Courrier', 'Helvetica', 'Roboto', 'Times New Roman' ],
    
    focused: false,

    withEditor: true,

	init() {
        this._super();
		this.set(
			'fontSizes',
            Array.from({ length: this.get('maxSize') - this.get('minSize') + 1 })
                .map((v, i) => this.get('minSize') + i)
        );
        !this.withEditor && this.set('focused', true);
	},

	didInsertElement() {
        if (this.get('withEditor')) {
            this.$("textarea").on("focus", () => this.set("focused", true));
            this.$("textarea").on("blur", () => this.set("focused", false));
        }
    },

	actions: {
		preventBlur(e) {
            if (this.get('withEditor')) {
                e && e.preventDefault();
                return false;
            }
		}
	}
});
