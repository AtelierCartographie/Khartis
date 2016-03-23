import Ember from 'ember';
import Struct from './struct';

let Mapping,
    ShapeMapping,
    SurfaceMapping,
    TextMapping;
    
let MappingFactory = Ember.Object.extend({});
MappingFactory.reopenClass({
  
  classForType(type) {
    switch (type) {
      case "quali.cat_surfaces":
        return SurfaceMapping;
      case "quali.cat_symboles":
        return ShapeMapping;
      case "quali.ordre_symboles":
        return ShapeMapping;
      case "quali.taille_valeur":
        return SurfaceMapping;
      case "quanti.val_surfaces":
        return SurfaceMapping;
      case "quanti.val_symboles":
        return ShapeMapping;
    }
    throw new Error(`Unknow mapping type ${type}`);
  },
  
  createInstance(type, props = {}) {
    let o = this.classForType(type).create(props);
    o.set('type', type);
    return o;
  },
  restoreInstance(json, refs) {
    if (json != null) {
      let o = this.classForType(json.type).restore(json, refs);
      return o;
    } else {
      return null;
    }
  }
});

Mapping = Struct.extend({
  type: null,
  export(props) {
    return this._super(Object.assign({
      type: this.get('type')
    }, props));
  }
});
Mapping.reopenClass({
  restore(json, refs = {}) {
    let o = this._super(json, refs);
    o.setProperties({
      type: json.type
    });
    return o;
  }
});

ShapeMapping = Mapping.extend({
  shape: "point",
  scaleOf: "size",
  color: "#014FF0",
  size: 6,
  export(props) {
    return this._super(Object.assign({
      shape: this.get('shape'),
      scaleOf: this.get('scaleOf'),
      color: this.get('color'),
      size: this.get('size')
    }, props));
  }
});

ShapeMapping.reopenClass({
  restore(json, refs = {}) {
    let o = this._super(json, refs);
    o.setProperties({
      shape: json.shape,
      scaleOf: json.scaleOf,
      color: json.color,
      size: json.size
    });
    return o;
  }
});

SurfaceMapping = Mapping.extend({
  pattern: "solid",
  color: "#01BF40",
  export(props) {
    return this._super({
      pattern: this.get('pattern'),
      color: this.get('color')
    });
  }
});

SurfaceMapping.reopenClass({
  restore(json, refs = {}) {
    let o = this._super(json, refs);
    o.setProperties({
      pattern: json.pattern,
      color: json.color
    });
    return o;
  }
});

TextMapping = ShapeMapping.extend({
  shape: "text",
  scaleOf: "size",
  color: "#014FF0",
  size: 10,
  labelCol: null,
  
  labelAtIndex(index) {
    return this.get('labelCol.cells').objectAt(index).postProcessedValue();
  },
  
  export(props) {
    return this._super({
      labelCol: this.get('labelCol') ? this.get('labelCol._uuid') : null
    });
  }
});

TextMapping.reopenClass({
  restore(json, refs = {}) {
    let o = this._super(json, refs);
    o.setProperties({
      labelCol: json.labelCol ? refs[json.labelCol] : null
    });
    return o;
  }
});

export default MappingFactory;
export {Mapping, ShapeMapping, SurfaceMapping, TextMapping};
