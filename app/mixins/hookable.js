import Ember from 'ember';

export default Ember.Mixin.create({

  _hooks: null,

  init() {
    this._super();
    this.set('_hooks', {});
  },

  addHook(type, cb) {
    !this.get('_hooks')[type] && (this.get('_hooks')[type] = []);
    this.get('_hooks')[type].push(cb);
  },

  removeHook(type, cb) {
    if (this.get('_hooks')[type]) {
      this.get('_hooks')[type] = this.get('_hooks')[type].filter(r => r != cb);
    }
  },

  processHooks(type, args, thisArg) {
    args = args || [];
    thisArg = thisArg || this;
    let promises = [];
    if (this.get('_hooks')[type]) {
      this.get('_hooks')[type].forEach( cb => {
        promises.push(cb.apply(thisArg, args));
      });
    }
    return Promise.all(promises);
  }

});
