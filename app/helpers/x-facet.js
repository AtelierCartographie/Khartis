import Ember from 'ember';

export default Ember.Helper.helper(function(hash, opts) {
    
    var ret = {};
    ret['is'+hash[0].replace(/^./, g => g.toUpperCase())] = true;
    
	return ret;
	
});