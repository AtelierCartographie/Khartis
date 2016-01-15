import Em from 'ember';
import CSV from 'npm:csv-string';

export default Ember.Controller.extend({
   
   csvContent: "sdlkfjsdlkf jsdf",
   
    
   actions: {
       
       parseCsvContent: function(text) {
           this.set('csvContent', text);
           let arr = CSV.parse(text);
           console.log(arr);
       }
       
   } 
    
});