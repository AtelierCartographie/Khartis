import WrapperAbstract from '../-abstract/component';
/* global Em */

export default WrapperAbstract.extend({

  maxQty: function() {
    return this.get('obj.rules').reduce((max, r) => {
      max = Math.max(max, r.get('qty'));
      return max;
    }, 1);
  }.property('obj.rules.[]')
  
});
