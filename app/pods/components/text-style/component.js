import Ember from 'ember';

const fakeD = Ember.Object.create({
    fontSize: 10,
    underline: false,
    bold: false,
    italic: false
});

export default Ember.Component.extend({

    data: fakeD,

    didInsertElement() {
        
    },

    actions: {
        test() {
            console.log(arguments);
        }
    }

});