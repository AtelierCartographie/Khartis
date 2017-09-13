import Ember from 'ember';
import moment from 'moment';

export default Ember.Helper.helper(function (hash) {
  if (hash[0]) {
    return moment(hash[0]).format(hash[1]);
  } else {
    return "";
  }
});
