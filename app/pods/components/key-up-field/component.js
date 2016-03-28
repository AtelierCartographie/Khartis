import Ember from 'ember';

export default Ember.TextField.extend({
	
	attributeBindings: ['autocomplete'],
	
	autocomplete: "off",
    
    fakeEl: null,
    
    willDestroyElement: function() {
        this.sendAction('focusOutAction');
    },
	
	keyDown: function(event){
		this.sendAction('keyDownAction', event);
	},
	
	keyUp: function(event){
        //Ember.run.later(() => this.$().width(this.textWidth()+10));
		this.sendAction('keyUpAction', event);
	},
	
	focusOut: function(event) {
		this.sendAction('focusOutAction', event);
	},
	
	focusIn: function(event) {
		this.sendAction('focusInAction', event);
	},

    
    textWidth: function(text, font) {
        
        var fakeEl = this.get('fakeEl');
    
        if (!fakeEl) {
            this.set('fakeEl', fakeEl = $('<span>').hide().appendTo(document.body));
        }

        fakeEl.text(text || this.$().val() || this.$().text()).css('font', font || this.$().css('font'));
        
        return fakeEl.width(); 
    }
	
});

