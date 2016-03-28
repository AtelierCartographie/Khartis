import Ember from 'ember';
import AbstractComponent from './abstract';

export default AbstractComponent.extend({
    
    filterField: "",
    
    filterData: function() {
        
        return new Ember.RSVP.Promise((resolve, reject) => {
            
            var levenshteined = this.get('suggestionProvider').map( x => {
                
                let fields = this.get('filterField');
                
                if (!(fields instanceof Array)) {
                    fields = Em.A([fields]);
                }
                
                var min = fields.reduce((min, field) => {
                    
                    let parts = x.get(field).split(' ');
                    
                    for (var i = 0; i < parts.length; i++) {
                        
                        min = Math.min(min, TolerentLevenshtein(parts.slice(i).join(' '), this.get('query')));
                        
                    }
                    
                    return min;
                    
                }, 1000);

               return {
                  val: x,
                  lv: min
                };
                
            });

            resolve(
                levenshteined.filter( x => {
                    return (x.lv <= Math.log(Math.pow(this.get('query').length+1, 4/5))) 
                }).sortBy('lv').map( x => x.val )
            );

        });
    
    }
    
});

var tolerance = 0;
var TolerentLevenshtein = function(a, b) {
    
    a = a.toLowerCase();
    b = b.toLowerCase();
    
    if (a.length > b.length + tolerance) {
        a = a.substring(0, b.length + tolerance);
    } else if (b.length > a.length + tolerance) {
        b = b.substring(0, a.length + tolerance);
    }
    
    return Levenshtein(a, b);
};

var Levenshtein = function(a, b) {
    
  if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length; 

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++) {
    for(j = 1; j <= a.length; j++) {
      if(b.charAt(i-1) == a.charAt(j-1)) {
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
};
