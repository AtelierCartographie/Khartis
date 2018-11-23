import Ember from "ember";

export default Ember.Helper.helper(function([ str, length ]) {
  let s = str.string || str;
  if (s && s.length > length - 3) {
    return `${s.substring(0, length-3)}...`;
  }
  return s;
});
