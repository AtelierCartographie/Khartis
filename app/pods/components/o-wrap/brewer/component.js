import WrapperAbstract from '../-abstract/component';
import Colorbrewer from 'khartis/utils/colorbrewer';
import PatternMaker from 'khartis/utils/pattern-maker';
/* global Em */

export default WrapperAbstract.extend({
  
  angles: [0, 45, 90, 135],
  
  availableColorSets: function() {
    let master = this.get('obj.scale.diverging') ? Colorbrewer.diverging : Colorbrewer.sequential,
        classes = this.get('obj.scale.classes');
    
      return Object.keys(master).map( k => {
        
        let colors = Colorbrewer.Composer.compose(
          k, 
          this.get('obj.scale.diverging'),
          this.get('obj.visualization.reverse'), 
          this.get('obj.scale.classes'),
          this.get('obj.scale.classesBeforeBreak')
        );
        
        return {
          colors: colors,
          key: k
        };
        
      }).filter( x => x.colors != null );
    
  }.property('obj.visualization._defferedChangeIndicator', 'obj.scale._defferedChangeIndicator'),

  availableColorSetsMap: function() {
    return this.get('availableColorSets').reduce( (o, c) => {
      o[c.key] = c.colors;
      return o;
    }, {});
  }.property('availableColorSets.[]'),
  
  availablePatterns: function() {
    return this.angles.map( (angle) => {
        return PatternMaker.Composer.build({
          angle: angle,
          stroke: 1,
          type: "lines"
        });
    });
  }.property('obj.scale._defferedChangeIndicator')
  
  
});
