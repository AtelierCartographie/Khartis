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
        let reqVal = "electron";
        const {ipcRenderer} = require(reqVal);
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
          this.transitionTo('graph', res);
        })
        .catch( res => {
          if (res.error === "problem:file") {
            this.get('ModalManager')
              .show('confirm', Ember.String.capitalize(this.get('i18n').t('project.step1.importPoject.loadError').string),
                Ember.String.capitalize(this.get('i18n').t('general.error', {count: 1}).string),
                null,
                Ember.String.capitalize(this.get('i18n').t('general.cancel').string));
          } else if (res.error === "problem:exists") {
            this.get('ModalManager')
              .show('confirm', Ember.String.capitalize(this.get('i18n').t('project.step1.importPoject.projectExists').string),
                Ember.String.capitalize(this.get('i18n').t('general.warning', {count: 1}).string),
                Ember.String.capitalize(this.get('i18n').t('general.overwrite').string),
                Ember.String.capitalize(this.get('i18n').t('general.duplicate').string))
              .then( () => {
                this.get('store').overwriteProject(res.project);
                this.transitionTo('graph', res.project._uuid);
              })
              .catch( () => {
                this.transitionTo('graph', this.get('store').forkProject(res.project)._uuid);
              });
          }
        })
        .catch(console.log)
    },

    exportProject() {
      this.get('store').saveAsFile();
    }
    
  } 
    
});
