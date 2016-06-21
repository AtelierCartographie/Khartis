import Ember from "ember";
import config from 'mapp/config/environment';

export default Ember.Helper.helper(function([ str ]) {
  return config.rootURL+str;
});
