import Em from 'ember';


export default Ember.Controller.extend({

  isHelpLayerVisible: true,

  actions: {

    setLocale(locale) {
      this.set('i18n.locale', locale);
    },

    toggleHelp(){
      this.toggleProperty('isHelpLayerVisible')
    }
  }

});
