import WrapperAbstract from '../-abstract/component';
import Colorbrewer from 'mapp/utils/colorbrewer';
/* global Em */

export default WrapperAbstract.extend({
  
  angles: [0, 45, 90, 135],

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
    return this.angles.reduce( (arr, angle) => {
      for (var i = 1; i <= 3; i++) {
        arr.push({
          angle: angle,
          stroke: i,
          key: `${angle}-${i}`
        });
      }
      return arr; 
    }, []);
  }.property('obj.scale._defferedChangeIndicator')
  
});
