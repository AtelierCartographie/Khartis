import Ember from 'ember';

const EventNotifier = Ember.Object.extend(Ember.Evented, {
    triggerThen(...args) {
        console.log(args);
        return new Promise( (res, rej) => {
            this.trigger.apply(this, args);
            Ember.run.scheduleOnce('afterRender', this, function() {
                res(this);
            });
        });
    }
});

export default EventNotifier;

export const EventNotifierFeature = Ember.Mixin.create({

    _eventNotifier: null,

    willDestroyElement() {
        this._super();
        this.get('_eventNotifier') && this.unregisterNotifier(this.get('_eventNotifier'));
    },

    eventNotifier: Ember.computed({
        get() {
            return this.get('_eventNotifier');
        },
        set(k, v) {
            if (v && v instanceof EventNotifier) {
                this.get('_eventNotifier') && this.unregisterNotifier(this.get('_eventNotifier'));
                this.set('_eventNotifier', v);
                this.registerNotifier(v);
                return v;
            }
            throw new Error("Passed event notifier is null or not an instance of EventNotifier");
        }
    }),
    
    unregisterNotifier(notifier) {
        this._super(notifier);
    },

    registerNotifier(notifier) {
        this._super(notifier);
    }

});