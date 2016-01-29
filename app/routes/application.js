import Ember from 'ember';


export default Ember.Route.extend({
    
   
   actions: {
       
       navigateTo(url) {
           this.transitionTo(url);
       }
       
   } 
    
});