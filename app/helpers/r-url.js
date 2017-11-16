import Ember from "ember";
import config from 'khartis/config/environment';

export default Ember.Helper.helper(function([ str ], namedArgs) {
  if (namedArgs.spaceToDash) {
    return config.rootURL+str;
  } else {
    return config.rootURL+str.replace(/\s/g, '_');
  }
});
