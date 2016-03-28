import Ember from 'ember';

let DATA_TYPE = {
    TEXT: "text",
    NUMERIC: "numeric"
};

export default Ember.TextField.extend({
    
    dataType: DATA_TYPE.TEXT,
    
    precision: 6
    
/*    isNumeric: function() {
        return this.get('dataType') === DATA_TYPE.NUMERIC;
    }.property('dataType'),
    
    isInteger: function() {
        return this.get('isNumeric') && this.get('precision') === 0;
    }.property('isNumeric', 'precision')*/

    /*sanitize: function() {
        
        if (this.get('value') != null && this.get('isNumeric')) {
            
            var val = this.get('value')
                .replace(/[a-zA-Z]+/g, "")
                .replace(/,/g, ".");
            
            this.set('value', val);
                
        }
    
    }.observes('value', 'precision', 'dataType'),
    
    dotDisallowed() {
       return this.get('value').length == 0
            || (this.get('value') != null && this.get('value').indexOf('.') >= 0)
            || this.get('isInteger');
    },
                                      
    didInsertElement() {
        if (this.get('isNumeric')) {
            this.$().keypress( (key) => {
                if (key.charCode != 45
                    && (key.charCode != 44 || this.dotDisallowed())
                    && (key.charCode != 46 || this.dotDisallowed())
                    && (key.charCode != 0)
                    && (key.charCode < 48 || key.charCode > 57)) return false;
            });
        }
    }*/
    
});
