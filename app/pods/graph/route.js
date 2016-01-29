import Ember from 'ember';

export default Ember.Route.extend({
    renderTemplate: function() {
        this.render({ outlet: 'main' });
        this.render('graph/sidebar', { outlet: 'sidebar' });
    }
});