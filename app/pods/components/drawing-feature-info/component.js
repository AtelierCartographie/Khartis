import Ember from 'ember';
import d3 from 'npm:d3';
import { DRAWING_EVENT } from '../map-editor/drawing';

export default Ember.Component.extend({

  data: null,

  inheritedMarkerStartColor: Ember.computed('data.markerStartColor', {
    get() {
      return this.get('data.markerStartColor') == null;
    },
    set(k, v) {
      if (v) {
        this.set('data.markerStartColor', null);
      } else {
        this.set('data.markerStartColor', this.get('data.color'));
      }
      return v;
    }
  }),

  inheritedMarkerEndColor: Ember.computed('data.markerEndColor', {
    get() {
      return this.get('data.markerEndColor') == null;
    },
    set(k, v) {
      if (v) {
        this.set('data.markerEndColor', null);
      } else {
        this.set('data.markerEndColor', this.get('data.color'));
      }
      return v;
    }
  }),

  actions: {
    close() {
      this.get('eventNotifier').trigger(DRAWING_EVENT, "unselect");
    },
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
