import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel(transition) {
    let redirect = transition.intent.url;
    console.log(redirect);
    if (!/\.\w{3,4}$/.test(redirect)) {
      redirect = redirect + "/index.html";
    }
    window.location = redirect;
  }
});