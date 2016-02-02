import Ember from 'ember';


var GrowlMessage = Ember.Component.extend({
    
    classNameBindings: [":growl-message", "level"],
    
    message: null,
    level: null,
    lifeTime: 2000,
    
    click: function() {
        
        this.sendAction('dismiss');
        
    },
    
    didInsertElement: function() {
        
        Ember.run.later(() => this.$().addClass('active'));
        
        setTimeout(() => {
            
            this.$().addClass('dying');
            this.$().bind('transitionend', () => this.sendAction('dismiss'));
            
        }, this.get('lifeTime'));

    }
    
});


export default GrowlMessage;