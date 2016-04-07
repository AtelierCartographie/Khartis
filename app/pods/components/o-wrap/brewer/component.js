import WrapperAbstract from '../-abstract/component';
import Colorbrewer from 'mapp/utils/colorbrewer';
/* global Em */

export default WrapperAbstract.extend({
  
  patterns: ["horizontal", "vertical", "1of8", "2of8", "diagonal"],

  availableColorSets: function() {
    let master = this.get('obj.scale.diverging') ? Colorbrewer.diverging : Colorbrewer.sequential,
        classes = this.get('obj.scale.classes');
    
      return Object.keys(master).map( k => {
        return {
          colors: master[k][classes],
          key: k
        };
      }).filter( x => x.colors != null );
    
  }.property('obj.scale._defferedChangeIndicator'),
  
  availablePatterns: function() {
    return this.patterns.reduce( (arr, name) => {
      for (var i = 1; i <= 3; i++) {
        arr.push({
          name: name,
          stroke: i
        });
      }
      return arr; 
    }, []);
  }.property('obj.scale._defferedChangeIndicator')
  
});
