import Ember from 'ember';

export default Ember.Component.extend({
  
    tpl: null,
    
    init() {
      this.computeLayoutName();
      this._super();
    },
    
    computeLayoutName: function(locale = this.get('i18n.locale')) {
      let layoutName = this.get('tpl').replace(/\{locale\}/, locale),
          tpl = Ember.getOwner(this).lookup(`template:${layoutName}`);
      
      if (tpl) {
        this.set('layout', tpl);
      } else if (locale !== "fr") {
        this.computeLayoutName("fr");
      } else {
        throw new Error(`Template not found ${layoutName}`);
      }
    }
  
});
