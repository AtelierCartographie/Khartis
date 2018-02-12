import Ember from 'ember';
import AbstractDrawing from './abstract-drawing';

let Text = AbstractDrawing.extend({
    type: "text",
    text: "text...",
    fontSize: 12,
    align: "middle",
    underline: false,
    bold: false,
    italic: false,

    deferredChange: Ember.debouncedObserver(
        'positioning', 'pt._defferedChangeIndicator',
        'color', 'text', 'fontSize', 
        'align', 'underline', 'bold', 'italic',
        function() {
          this.notifyDefferedChange();
        },
        20),

    export(props) {
        return this._super(Object.assign({
            text: this.get('text'),
            fontSize: this.get('fontSize'),
            align: this.get('align'),
            underline: this.get('underline'),
            bold: this.get('bold'),
            italic: this.get('italic')
        }, props));
    }
});

Text.reopenClass({
    restore(json, refs = {}, opts = {}) {
        return this._super(json, refs, {
            ...opts,
            text: json.text,
            fontSize: json.fontSize,
            align: json.align,
            underline: json.underline,
            bold: json.bold,
            italic: json.italic
        });
    }
});


export default Text;