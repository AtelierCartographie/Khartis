import Ember from 'ember';
import Worker from 'ember-web-workers/services/worker';
import config from 'khartis/config/environment';
const { get, RSVP } = Ember;

export default Worker.extend({

  init() {
    this._super();
    this.set('webWorkersPath', config.rootURL + this.get('webWorkersPath'));
  },

  open(name) {
    const callbackCb = (data) => {
      callbackCb.callback(data);
    };
    callbackCb.callback = (data) => {};
    const meta = this._wakeUp(name, callbackCb, true);
    const promise = get(meta, 'deferred.promise').then(() => ({
      postMessage: (data) => {
        const deferred = RSVP.defer();
        const channel = new MessageChannel();

        channel.port2.onmessage = (e) => deferred.resolve(e.data);
        get(meta, 'worker').postMessage(data, [channel.port1]);

        return deferred.promise;
      },
      onMessage: (fn) => {
        callbackCb.callback = fn;
      },
      terminate: () => {
        this._cleanMeta(meta);
        return RSVP.resolve();
      }
    }));

    this.get('_cache').pushObject(meta);

		return promise;
  }
});
