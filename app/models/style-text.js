import Ember from 'ember';
import Struct from './struct';

const DEFAULT_FONT = "Roboto";

let StyleText = Struct.extend({
    bold: false,
    underline: false,
    italic: false,
    size: 10,
    font: "Roboto",
    color: "#404040",
    anchor: "start",

    deferredChange: Ember.debouncedObserver(
        'bold', 'underline', 'italic',
        'size', 'font', 'color', 'anchor',
        function() {
          this.notifyDefferedChange();
        },
        10),

    export() {
        return this._super({
            bold: this.get('bold'),
            underline: this.get('underline'),
            italic: this.get('italic'),
            size: this.get('size'),
            font: this.get('font'),
            color: this.get('color'),
            anchor: this.get('anchor')
        });
    }
});

StyleText.reopenClass({
    restore(json, refs = {}) {
        return this._super(json, refs, {
            bold: json.bold,
            underline: json.underline,
            italic: json.italic,
            size: json.size,
            font: json.font,
            color: json.color,
            anchor: json.anchor
        });
    }
});

export default StyleText;