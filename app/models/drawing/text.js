import Ember from 'ember';
import AbstractDrawing from './abstract-drawing';

let Text = AbstractDrawing.extend({
    type: "text",
    text: "text...",
    fontSize: 12,
    align: "middle",

    deferredChange: Ember.debouncedObserver(
        'positioning', 'x', 'y', 'geoX', 'geoY',
        'color', 'text', 'fontSize',
        'align',
        function() {
          this.notifyDefferedChange();
        },
        25),

    export(props) {
        return this._super(Object.assign({
            text: this.get('text'),
            fontSize: this.get('fontSize'),
            align: this.get('align')
        }, props));
    }
});

Text.reopenClass({
    restore(json, refs = {}, opts = {}) {
        return this._super(json, refs, {
            ...opts,
            text: json.text,
            fontSize: json.fontSize,
            align: json.align
        });
    }
});


export default Text;