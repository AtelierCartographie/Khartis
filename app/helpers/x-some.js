import Ember from 'ember';

export default Ember.Helper.helper(function(hash, opts) {
    
    return hash.some( x => x );
	
});