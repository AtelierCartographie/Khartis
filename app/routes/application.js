import Ember from 'ember';

export default Ember.Route.extend({
  
  store: Ember.inject.service(),
  
  beforeModel() {
    return this.get('Dictionary').load();
  },
  
  actions: {
      
    navigateTo(url) {
      
      switch(url) {
        case 'spreadsheet':
          this.transitionTo(url, this.get('store').versions().current()._uuid);
          break;
        case 'graph':
          this.transitionTo(url, this.get('store').versions().current()._uuid);
          break;
        default:
          this.transitionTo(url);
      }
      
    },
    
    setLocale(locale) {
      this.set('i18n.locale', locale);
    }
    
  } 
    
});
