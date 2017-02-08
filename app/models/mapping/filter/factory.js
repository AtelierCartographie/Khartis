import Ember from 'ember';
import Struct from 'khartis/models/struct';
import RangeFilter from './range';
import CategoryFilter from './category';

let FilterFactory = Ember.Object.extend({});
FilterFactory.reopenClass({
  
  classForType(type) {
    switch (type) {
      case "range":
        return RangeFilter;
      case "category":
        return CategoryFilter;
    }
    throw new Error(`Unknow filter type ${type}`);
  },
  
  createInstance(type, props = {}) {
    let o = this.classForType(type).create(props);
    o.set('type', type);
    return o;
  },
  
  restoreInstance(json, refs) {
    console.log(json);
    if (json != null) {
      let o = this.classForType(json.type).restore(json, refs);
      return o;
    } else {
      return null;
    }
  }
  
});

export default FilterFactory;
