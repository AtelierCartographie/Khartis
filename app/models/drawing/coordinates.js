import Ember from 'ember';
import Struct from '../struct';

let Coordinates = Struct.extend({
    x: null,
    y: null,
    geoX: null,
    geoY: null,

    deferredChange: Ember.debouncedObserver(
        'x', 'y', 'geoX', 'geoY',
        function() {
          this.notifyDefferedChange();
        },
        20),

    getXY() {
        return [this.get('x'), this.get('y')];
    },

    getGeo() {
        return [this.get('geoX'), this.get('geoY')];
    },

    canBeGeoPositioned : function() {
        return this.get('geoX') != null && this.get('geoY') != null;
    }.property('geoX', 'geoY'),

    export(props) {
        return this._super(Object.assign({
            x: this.get('x'),
            y: this.get('y'),
            geoX: this.get('geoX'),
            geoY: this.get('geoY')
        }));
    }
});

Coordinates.reopenClass({
    restore(json, refs = {}, opts = {}) {
      return this._super(json, refs, {
        ...opts,
        x: json.x,
        y: json.y,
        geoX: json.geoX,
        geoY: json.geoY
      });
    }
});

export default Coordinates;