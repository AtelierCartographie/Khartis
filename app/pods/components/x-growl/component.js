import Ember from 'ember';
/* global Em */

export default Ember.Component.extend({
    
    growl: Ember.inject.service(),
    
    classNames: ["growl"],
    
    lifeTime: 3000,
    
    messages: null,
    
    init() {
      this._super();
      this.set('messages', Em.A());
    },
    
    didInsertElement() {
        
      this.get('growl').connect(this);

    },
    
    addMessage: function(message, level) {
        
      var msgO = Ember.Object.create({
          
          message: message,
          level: level
          
      });
      
      this.get('messages').unshiftObject(msgO);
        
    },
    
    actions: {
        
      removeMessage: function(msgO) {
          this.get('messages').removeObject(msgO);
      }
        
    }
    
    
});
