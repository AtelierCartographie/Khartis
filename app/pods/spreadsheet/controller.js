import Ember from 'ember';


export default Ember.Controller.extend({
  
    history: Ember.inject.service(),
  
    actions: {
      
      onSaveHistory() {
        this.get('history').save(this.get('model'));
      }
    
    }
  
});
