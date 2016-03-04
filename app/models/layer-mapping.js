import Ember from 'ember';
import Struct from './struct';

const SHAPE = "shape",
      SURFACE = "surface";

let Mapping,
    ShapeMapping,
    SurfaceMapping;

let MappingFactory = Ember.Object.extend({});
MappingFactory.reopenClass({
  createInstance(type, props = {}) {
    if (type === SHAPE) {
      return ShapeMapping.create(props);
    } else if (type === SURFACE) {
      return SurfaceMapping.create(props);
    } else {
      throw new Error(`Unknow mapping type ${type}`);
    }
  },
  restoreInstance(json, refs) {
    if (json != null) {
      if (json.type === SHAPE) {
        return ShapeMapping.restore(json, refs);
      } else if (json.type === SURFACE) {
        return SurfaceMapping.create(json, refs);
      } else {
        throw new Error(`Unknow mapping type ${json.type}`);
      }
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
  type: SHAPE,
  shape: "point",
  scaleOf: "size",
  color: "#014FF0",
  size: 4,
  export(props) {
    return this._super({
      shape: this.get('shape'),
      scaleOf: this.get('scaleOf'),
      color: this.get('color'),
      size: this.get('size')
    });
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
  type: SURFACE,
  pattern: "solid",
  export(props) {
    return this._super({
      pattern: this.get('pattern')
    });
  }
});

SurfaceMapping.reopenClass({
  restore(json, refs = {}) {
    let o = this._super(json, refs);
    o.setProperties({
      pattern: json.pattern
    });
    return o;
  }
});

export default MappingFactory;
export {Mapping, ShapeMapping, SurfaceMapping};
