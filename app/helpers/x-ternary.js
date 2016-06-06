import Ember from 'ember';

export default Ember.Helper.helper(function(hash, opts) {
    
    return hash[0] ? hash[1] : hash[2];
	
});
