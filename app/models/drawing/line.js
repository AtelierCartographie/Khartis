import Ember from 'ember';
import AbstractDrawing from './abstract-drawing';
import Coordinates from './coordinates';

let Line = AbstractDrawing.extend({
    type: "line",
    ptEnd: null,
    curve: 0,
    markerStart: null,
    markerEnd: "arrow-marker-end",
    strokeWidth: 3,
    dash: 0,

    canBeGeoPositioned: function() {
        return this.get('pt.canBeGeoPositioned') && this.get('ptEnd.canBeGeoPositioned');
    }.property('pt.canBeGeoPositioned', 'ptEnd.canBeGeoPositioned'),

    getCoordinates() {
        return this._super().concat(
             [this.get('ptEnd')]
        );
    },

    getDashArray() {
        if (this.get('dash') > 0) {
            return `${this.get('dash')}, ${this.get('dash')}`;
        }
        return null;
    },

    deferredChange: Ember.debouncedObserver(
        'positioning', 'pt._defferedChangeIndicator',
        'ptEnd._defferedChangeIndicator',
        'color', 'curve', 'markerStart', 'markerEnd',
        'strokeWidth', 'dash',
        function() {
          this.notifyDefferedChange();
        },
        20),

    export(props) {
        return this._super(Object.assign({
            ptEnd: this.get('ptEnd').export(),
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
            ptEnd: Coordinates.restore(json.ptEnd, refs),
            curve: json.curve,
            markerStart: json.markerStart,
            markerEnd: json.markerEnd,
            strokeWidth: json.strokeWidth,
            dash: json.dash
        });
    }
});

export default Line;