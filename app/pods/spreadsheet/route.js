import Ember from 'ember';

export default Ember.Route.extend({
    renderTemplate: function() {
        this.render("spreadsheet/sidebar", { outlet: "sidebar" });
        this.render({ outlet: "main" });
    },
    
    actions: {
        navigateTo(url) {
            this.transitionTo("/"+url);
        }
    }
    
});