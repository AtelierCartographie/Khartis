import Ember from 'ember';
import Struct from '../struct';

const LegendGroup = Struct.extend({
    layers: null,
    tx: null,
    ty: null,

    init() {
        this._super();
        if (!this.get('layers')) {
            this.set('layers', Em.A());
        }
    },

    deferredChange: Ember.debouncedObserver(
        'layers.[]', 'tx', 'ty',
        function() {
          this.notifyDefferedChange();
        },
        10),

    isMultiple: Ember.computed('layers.length', function() {
        return this.get('layers.length') > 1;
    }),

    hasLayer(layer) {
        return this.get('layers').find( l => l._uuid === layer._uuid );
    },

    removeLayer(layer) {
        this.get('layers').removeObject(layer);
    },

    pushLayer(layer) {
        if (!this.hasLayer(layer)) {
            this.get('layers').addObject(layer);
        }
    },

    unshiftLayer(layer) {
        if (!this.hasLayer(layer)) {
            this.get('layers').unshiftObject(layer);
        }
    },

    appendBefore(before, layers) {
        this.get('layers').replace(this.get('layers').indexOf(before), 0, layers);
    },
    
    appendAfter(before, layers) {
        this.get('layers').replace(this.get('layers').indexOf(before) + 1, 0, layers);
    },

    export() {
        return this._super({
            layers: this.get('layers').map( l => l._uuid ),
            tx: this.get('tx'),
            ty: this.get('ty')
        });
    }
});

LegendGroup.reopenClass({

    restore(json, refs = {}) {
        return this._super(json, refs, {
            layers: (json.layers && json.layers.map( l => refs[l] )) || Em.A(),
            tx: json.tx,
            ty: json.ty
        });
    }

});


export default LegendGroup;