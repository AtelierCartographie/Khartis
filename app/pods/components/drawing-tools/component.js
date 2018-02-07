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
    this.get('eventNotifier').trigger(DRAWING_EVENT, "activate");
    this.get('eventNotifier').trigger(DRAWING_EVENT, "select");
  },
  
  willDestroyElement() {
    this.get('eventNotifier').trigger(DRAWING_EVENT, "deactivate");
    this.get('eventNotifier').off(DRAWING_EVENT, this, this.handleDrawingEvent);
  },

  handleDrawingEvent(type) {
    this.set('selectedState', type);
  },

  actions: {
    switchDrawingState(state) {
        this.get('eventNotifier').trigger(DRAWING_EVENT, state);
    }
  }

});
