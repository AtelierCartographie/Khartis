import Ember from 'ember';

export default Ember.Component.extend({

    selected: null,

    markers: null,

    actions: {
        selectMarker(marker) {
            this.set('selected', marker);
        }
    }
});