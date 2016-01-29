import Ember from 'ember';

export default Ember.Route.extend({
    renderTemplate: function() {
        this.render({ outlet: 'main' });
        this.render("spreadsheet/sidebar", { outlet: "sidebar" });
    },
    
    actions: {
        navigateTo(url) {
            this.transitionTo("/"+url);
        }
    }
    
});