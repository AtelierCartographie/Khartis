import Ember from 'ember';
import Struct from '../struct';
import Coordinates from './coordinates';

let AbstractDrawing = Struct.extend({
    type: null,
    pt: null,
    positioning: null,
    color: "black",

    //transient
    dirtyCoordinates: false,
    
    canBeGeoPositioned: function() {
        return this.get('pt.canBeGeoPositioned');
    }.property('pt.canBeGeoPositioned'),

    getCoordinates() {
        return [this.get('pt')];
    },

    export(props) {
        return this._super(Object.assign({
            type: this.get('type'),
            pt: this.get('pt').export(),
            positioning: this.get('positioning'),
            color: this.get('color')
        }, props));
    }
});

AbstractDrawing.reopenClass({
    restore(json, refs = {}, opts = {}) {
      return this._super(json, refs, {
        ...opts,
        type: json.type,
        pt: Coordinates.restore(json.pt, refs),
        positioning: json.positioning,
        color: json.color
      });
    }
  });

export default AbstractDrawing;