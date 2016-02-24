import Ember from 'ember';


export default Ember.Route.extend({
   
   actions: {
       
    navigateTo(url) {
      
      switch(url) {
        case 'spreadsheet':
          this.transitionTo(url, this.get('store').versions().current()._uuid);
          break;
        case 'graph':
          this.transitionTo(url, this.get('store').versions().current()._uuid);
          console.log("OK graph");
          break;
        default:
          this.transitionTo(url);
      }
      
    }
    
   } 
    
});
