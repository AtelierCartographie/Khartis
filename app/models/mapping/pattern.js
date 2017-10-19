import Ember from 'ember';
import Struct from '../struct';

let Pattern = Struct.extend({
  angle: null,
  stroke: null,
  key: null,
  type: null,
  fn: null,

  export(props) {
    return this._super(Object.assign({
      angle: this.get('angle'),
      stroke: this.get('stroke'),
      key: this.get('key'),
      type: this.get('type')
    }, props));
  },

  fork() {
    let opts = this.export();
    delete opts._uuid;
    return Pattern.create(opts);
  }

});

Pattern.reopenClass({
  restore(json, refs = {}, opts = {}) {
    return this._super(json, refs, {
      ...opts,
      angle: json.angle,
      stroke: json.stroke,
      key: json.key,
      type: json.type
    });
  }
});

export default Pattern;
