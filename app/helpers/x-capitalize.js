import Ember from "ember";
const capitalize = Ember.String.capitalize;

export default Ember.Helper.helper(function([ string ]) {
  return capitalize(string);
});
