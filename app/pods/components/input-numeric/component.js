import Ember from 'ember';

export default Ember.TextField.extend({
    
    isInteger: false,

    attributeBindings: ['min', 'max', 'step'],

    numericValue: Ember.computed('value', {

        get() {
          let v = parseFloat(this.get('value'));
          return !isNaN(v) ? v : null;
        },

        set(key, val) {
            let v = parseFloat(val);
            v = !isNaN(v) ? v : '';
            return this.set('value', `${v}`);
        }

    }),
    
    
    sanitize: function() {
        
        if (this.get('value') != null) {
            
            var val = this.get('value')
                .replace(/[a-zA-Z]+/g, "")
                .replace(/,/g, ".");
            
            this.set('value', val);
                
        }
    
    }.observes('value'),
    
    
    dotDisallowed: function() {
        
       return this.get('value').length == 0 || (this.get('value') != null && this.get('value').indexOf('.') >= 0) || this.get('isInteger');
        
    },
                                      
    didInsertElement: function () {
        var self = this;
        this.$().keypress(function (key) {
            if (key.charCode != 44 && (key.charCode != 46 || self.dotDisallowed()) && (key.charCode != 45) && (key.charCode != 0) && (key.charCode < 48 || key.charCode > 57)) return false;
        })
    }
    
});
