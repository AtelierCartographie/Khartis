import Ember from 'ember';
import config from 'khartis/config/environment';

export default Ember.Controller.extend({

  thumbnailHeight: Ember.computed(function() {
    return config.mapThumbnail.height;
  }),

  backmapColor: Ember.computed(function() {
    return config.mapThumbnail.color;
  })

});
