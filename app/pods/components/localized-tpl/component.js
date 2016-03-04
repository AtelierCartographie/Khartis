import Ember from 'ember';

export default Ember.Component.extend({
  
    tpl: null,
    innerLayout: null,
    
    init() {
      this.computeLayoutName();
      this._super();
    },
    
    computeLayoutName: function() {
      
      this.set('innerLayout', null);
      
      let loadLayout = (locale) => {
        
        let layoutName = this.get('tpl').replace(/\{locale\}/, locale),
            tpl = Ember.getOwner(this).lookup(`template:${layoutName}`);
        
        return tpl;
        
      };
      
      let tpl = loadLayout(this.get('i18n.locale'));
      
      if (tpl) {
        Ember.run.later(this, () => this.set('innerLayout', tpl));
      } else {
        Ember.run.later(this, () => loadLayout("en"));
      }
      
    }.observes('tpl', 'i18n.locale')
  
});
