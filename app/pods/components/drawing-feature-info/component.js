import Ember from 'ember';
import d3 from 'npm:d3';

export default Ember.Component.extend({

  data: null,

  actions: {
    deleteFeature() {
      this.sendAction('onDeleteFeature', this.get('data'));
    },
    dataTextFocusOut() {
      if (!this.get('data.text').length) {
        this.set('data.text', 'text...');
      }
    },
    changePositioning(type) {
      if (type !== this.get('data.positioning')) {
        if (type === "geo" && this.get('data.canBeGeoPositioned')) {
          this.get('data').setProperties({
            positioning: "geo",
            dirtyCoordinates: true
          });
        } else if (type === "absolute") {
          this.get('data').setProperties({
            positioning: "absolute",
            dirtyCoordinates: true
          });
        }
      }
    }
  }

});
