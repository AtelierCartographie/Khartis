import Em from 'ember';


export default Ember.Controller.extend({

   isHelpLayerVisible:false,

   actions: {
     toggleHelp(){
       this.toggleProperty('isHelpLayerVisible')
     }
   }

});
