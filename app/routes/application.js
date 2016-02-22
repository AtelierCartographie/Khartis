import Ember from 'ember';


export default Ember.Route.extend({
    
   
   actions: {
       
    navigateTo(url) {
      
      switch(url) {
        case 'spreadsheet':
          this.transitionTo(url, this.get('store').versions().current()._uuid);
          break;
        default:
          this.transitionTo(url);
      }

    }
       
   } 
    
});
