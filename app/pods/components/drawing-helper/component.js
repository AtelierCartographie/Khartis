import Ember from 'ember';
import d3 from 'npm:d3';
import { DRAWING_EVENT } from '../map-editor/drawing';

export default Ember.Component.extend({

  selectedState: "select",

  init() {
    this._super();
    this.get('eventNotifier').on(DRAWING_EVENT, this, this.handleDrawingEvent);
  },

  willDestroyElement() {
    this.get('eventNotifier').off(DRAWING_EVENT, this, this.handleDrawingEvent);
  },

  handleDrawingEvent(type) {
    this.set('selectedState', type);
  }

});
