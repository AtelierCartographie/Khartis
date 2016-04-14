import WrapperAbstract from '../-abstract/component';
/* global Em */

export default WrapperAbstract.extend({

  availableColumns: function() {
    
  }.property('obj.columns.@each._defferedChangeIndicator')
  
});
