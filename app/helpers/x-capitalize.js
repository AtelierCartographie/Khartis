import Ember from "ember";

export default Ember.Helper.helper(function([ str ]) {
  if (str) {
    return Ember.String.capitalize(str.string);
  }
});
