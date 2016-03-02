import Ember from 'ember';
import Struct from './struct';
import {ColumnStruct} from './data';
import GraphLayout from './graph-layout';
/* global Em */

let ShapeRepresentation = Struct.extend({
  
  shape: "point",
  scaleOf: "size",
  fill: "#F09010",
  size: 4,
  
  export() {
    return this._super({
        shape: this.get('shape'),
        scaleOf: this.get('scaleOf'),
        fill: this.get('fill'),
        size: this.get('size')
    });
  }

});

ShapeRepresentation.reopenClass({
  
    restore(json, refs = {}) {
        let o = this._super(json, refs);
        o.setProperties({
            shape: json.shape,
            scaleOf: json.scaleOf,
            fill: json.fill,
            size: json.size
        });
        return o;
    }
    
});

let GraphLayer = Struct.extend({
  
  type: "shape",
  varCol: null,
  geoCols: null,
  representation: null,
  
  changeIndicator: null,
  
  isOfTypeSurface: function() {
    return this.get('type') === "surface";
  }.property('type'),
  
  isOfTypeShape: function() {
    return this.get('type') === "shape";
  }.property('type'),
  
  canBeSurface: function() {
    return this.get('geoCols').length === 1 
      && this.get('geoCols')[0].get('meta.type') === "geo";
  }.property('geoCols.[]'),
  
  representationChange: function() {
    this.notifyPropertyChange('changeIndicator');
  }.observes('representation.scaleOf'),
  
  scaleType() {
    return this.get('varCol.meta.type') === "numeric" ? "linear" : "ordinal";
  },
  
  typeChange: function() {
    if (this.get('type') === "shape" && this.get('representation') == null) {
      this.set('representation', ShapeRepresentation.create());
    } else {
      this.set('representation', null); //TODO : surface representation
    }
  }.observes('type').on("init"),
  
  export() {
    return this._super({
        type: this.get('type'),
        varCol: this.get('varCol') ? this.get('varCol._uuid') : null,
        geoCols: this.get('geoCols') ? this.get('geoCols').map( gc => gc.get('_uuid') ) : null,
        representation: this.get('representation') != null ? this.get('representation').export() : null
    });
  }

});

GraphLayer.reopenClass({
  
    restore(json, refs = {}) {
        let o = this._super(json, refs);
        o.setProperties({
            type: json.type,
            varCol: json.varCol ? refs[json.varCol] : null,
            geoCols: json.geoCols ? json.geoCols.map( gc => refs[gc] ) : null,
            representation: json.representation ? ShapeRepresentation.restore(json.representation, refs) : null
        });
        return o;
    }
    
});

export default GraphLayer;
