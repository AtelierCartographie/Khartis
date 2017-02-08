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
    },

    didTransition: function didTransition() {
      if (window.process) {
        const {ipcRenderer} = require('electron');
        ipcRenderer.on("importProject", (evt, data) => {
          this.send("loadExternalProject", data);
        });
        ipcRenderer.on("exportProject", (evt) => {
          this.send("exportProject");
        });
      }
    },

    loadExternalProject(data) {
      this.get('store').loadFromFile(data)
        .then( res => {
          this.transitionTo('graph', this.get('store').list().get('lastObject._uuid'));
        })
        .catch( res => {
          this.get('ModalManager')
            .show('confirm', Ember.String.capitalize(this.get('i18n').t('project.step1.importPoject.loadError').string),
              Ember.String.capitalize(this.get('i18n').t('general.error', {count: 1}).string),
              null,
              Ember.String.capitalize(this.get('i18n').t('general.cancel').string));
        })
        .catch(console.log)
    },

    exportProject() {
      this.get('store').saveAsFile();
    }
    
  } 
    
});
