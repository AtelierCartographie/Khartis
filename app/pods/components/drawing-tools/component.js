import Ember from 'ember';
import d3 from 'npm:d3';
import { DRAWING_EVENT } from '../map-editor/drawing';

export default Ember.Component.extend({

  selectedState: "select",

  init() {
    this._super();
    this.get('eventNotifier').on(DRAWING_EVENT, this, this.handleDrawingEvent);
  },

  didInsertElement() {
    this.get('eventNotifier').trigger(DRAWING_EVENT, "awake");
    this.get('eventNotifier').trigger(DRAWING_EVENT, "select");
  },
  
  willDestroyElement() {
    this.get('eventNotifier').trigger(DRAWING_EVENT, "idle");
    this.get('eventNotifier').off(DRAWING_EVENT, this, this.handleDrawingEvent);
  },

  handleDrawingEvent(type) {
    this.set('selectedState', type);
  },

  actions: {
    switchDrawingState(state) {
      if (state !== this.get('selectedState')) {
        this.get('eventNotifier').trigger(DRAWING_EVENT, state);
      } else {
        this.get('eventNotifier').trigger(DRAWING_EVENT, "select");
      }
    }
  }

});
