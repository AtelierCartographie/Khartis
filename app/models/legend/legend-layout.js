import Ember from 'ember';
import Struct from '../struct';
import LegendGroup from './legend-group';

var LegendLayout = Struct.extend({
    groups: null,
    opacity: 0.85,
    stacking: "horizontal",

    init() {
        this._super();
        if (!this.get('groups')) {
            this.set('groups', Em.A([LegendGroup.create()]));
        }
    },

    deferredChange: Ember.debouncedObserver(
        'groups.[]', 'groups.@each._defferedChangeIndicator',
        'opacity','stacking',
        function() {
          this.notifyDefferedChange();
        },
        10),

    mainGroup: Ember.computed('groups.[]', function() {
        return this.get('groups').objectAt(0);
    }),

    stackingHori: Ember.computed('stacking', {
        get() {
          return this.get('stacking') === "horizontal";
        },
        set(k,v) {
          if (v) {
            this.set('stacking', "horizontal");
          } else {
            this.set('stackingVerti', true);
          }
          return v;
        }
      }),
    
      stackingVerti: Ember.computed('stacking', {
        get() {
          return this.get('stacking') === "vertical";
        },
        set(k,v) {
          if (v) {
            this.set('stacking', "vertical");
          } else {
            this.set('stackingHori', true);
          }
          return v;
        }
      }),

    getLayerGroup(layer) {
        return this.get('groups').find( g => g.hasLayer(layer) );
    },

    detachLayers(layerOrGroup) {
        if (layerOrGroup instanceof LegendGroup) {
            let layers = layerOrGroup.get('layers');
            layerOrGroup.set('layers', Em.A());
            return layers;
        } else {
            let group = this.getLayerGroup(layerOrGroup);
            if (group) {
                group.removeLayer(layerOrGroup);
            }
            return [layerOrGroup]; 
        }
    },

    cleanGroups() {
        this.set('groups', this.get('groups').filter( g => g.get('layers.length') ));
    },

    layerToGroup(layer) {
        let group = this.getLayerGroup(layer);
        if (group && group.get('isMultiple')) {
            group.removeLayer(layer);
            group = null;
        }
        if (!group) {
            group = LegendGroup.create({
                layers: Em.A([layer])
            });
        }
        return group;
    },

    addGroupIfNeeded(group) {
        if (this.get('groups').indexOf(group) === -1) {
            this.get('groups').addObject(group);
        }
    },

    removeLayer(layer) {
        let group = this.get('groups').find( g => g.hasLayer(layer) );
        if (group) {
            group.removeLayer(layer);
            if (!group.get('isMultiple')) {
                this.get('groups').removeObject(object);
            }
        }
    },

    addLayer(layer) {
        let group = this.get('mainGroup');
        if (!group) {
            this.get('groups').addObject(group = new LayerGroup());
        }
        group.pushLayer(layer);
    },

    export() {
        return this._super({
            groups: this.get('groups').map( g => g.export() ),
            opacity: this.get('opacity'),
            stacking: this.get('stacking')
        });
    }
});

LegendLayout.reopenClass({
  
    restore(json, refs = {}) {
        return this._super(json, refs, {
            groups: (json.groups && json.groups.map( jg => LegendGroup.restore(jg, refs) )) || Ember.A(),
            opacity: json.opacity,
            stacking: json.stacking
        });
    }

});

export default LegendLayout;
