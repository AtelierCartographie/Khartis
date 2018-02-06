import Ember from 'ember';
import Struct from '../struct';

let AbstractDrawing = Struct.extend({
    type: null,
    x: null,
    y: null,
    geoX: null,
    geoY: null,
    positioning: null,
    color: "black",

    getCoordinates() {
        if (this.get('positioning') === "geo") {
            return [
                [this.get('geoX'), this.get('geoY')]
            ];
        } else {
            return [
                [this.get('x'), this.get('y')]
            ];
        }
    },

    export(props) {
        return this._super(Object.assign({
            type: this.get('type'),
            x: this.get('x'),
            y: this.get('y'),
            geoX: this.get('geoX'),
            geoY: this.get('geoY'),
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
        x: json.x,
        y: json.y,
        geoX: json.geoX,
        geoY: json.geoY,
        positioning: json.positioning,
        color: json.color
      });
    }
  });

export default AbstractDrawing;