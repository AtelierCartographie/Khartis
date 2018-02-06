import Ember from 'ember';
import AbstractDrawing from './abstract-drawing';

let Line = AbstractDrawing.extend({
    type: "line",
    xEnd: null,
    yEnd: null,
    geoXEnd: null,
    geoYEnd: null,
    curve: null,
    markerStart: null,
    markerEnd: "arrow-marker-end",
    strokeWidth: null,
    dash: 0,

    getCoordinates() {
        return this._super().concat(
             this.get('positioning') === "geo" ? [[this.get('geoXEnd'), this.get('geoYEnd')]] : [[this.get('xEnd'), this.get('yEnd')]]
        );
    },

    getDashArray() {
        if (this.get('dash') > 0) {
            return `${this.get('dash')}, ${this.get('dash')}`;
        }
        return null;
    },

    deferredChange: Ember.debouncedObserver(
        'positioning', 'x', 'y', 'geoX', 'geoY',
        'color', 'curve', 'markerStart', 'markerEnd',
        'strokeWidth', 'dash',
        function() {
          this.notifyDefferedChange();
        },
        25),

    export(props) {
        return this._super(Object.assign({
            xEnd: this.get('xEnd'),
            yEnd: this.get('yEnd'),
            geoXEnd: this.get('geoXEnd'),
            geoYEnd: this.get('geoYEnd'),
            curve: this.get('curve'),
            markerStart: this.get('markerStart'),
            markerEnd: this.get('markerEnd'),
            strokeWidth: this.get('strokeWidth'),
            dash: this.get('dash')
        }, props));
    }
});

Line.reopenClass({
    restore(json, refs = {}, opts = {}) {
        return this._super(json, refs, {
            ...opts,
            xEnd: json.xEnd,
            yEnd: json.yEnd,
            geoXEnd: json.geoXEnd,
            geoYEnd: json.geoYEnd,
            curve: json.curve,
            markerStart: json.markerStart,
            markerEnd: json.markerEnd,
            strokeWidth: json.strokeWidth,
            dash: json.dash
        });
    }
});

export default Line;