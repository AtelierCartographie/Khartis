import Ember from 'ember';
import Line from "./line";
import Text from "./text";

let DrawingFactory = Ember.Object.extend({});
DrawingFactory.reopenClass({
  
  classForType(type) {
    switch (type) {
      case "line":
        return Line;
      case "text":
        return Text;
    }
    throw new Error(`Unknow mapping type ${type}`);
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

export default DrawingFactory;
