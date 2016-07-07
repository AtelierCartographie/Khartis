import Ember from 'ember';

export default Ember.TextField.extend({
    
    isInteger: false,

    min: -Number.MAX_VALUE,
    max: Number.MAX_VALUE,
    numericValue: null,

    nullable: false,
    
    sanitize: function() {
        
        if (this.get('value') != null) {
            
            var val = this.get('value')
                .replace(/[a-zA-Z]+/g, "")
                .replace(/,/g, ".");
            
            this.set('value', val);
                
        }
    
    }.observes('value'),

    didReceiveAttrs() {
      this.set('value', this.get('numericValue') != null ? `${this.get('numericValue')}` : null);
    },

    keyUp(e) {
      if (e.keyCode === 13) {
        this.commitValue();
      }
    },

    focusOut() {
      this.commitValue();
    },

    commitValue() {
      if (this.get('nullable') && Ember.isEmpty(this.get('value'))) {
        this.sendAction("update", null);
      } else {
        if (this.get('value') < this.get('min')) {
          this.set('value', `${this.get('min')}`);
        }
        if (this.get('value') > this.get('max')) {
          this.set('value', `${this.get('max')}`);
        }
      }
      this.sendAction("update", this.get('value'));
    },
    
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
