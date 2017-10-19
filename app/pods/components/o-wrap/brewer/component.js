import WrapperAbstract from '../-abstract/component';
import Colorbrewer from 'khartis/utils/colorbrewer';
import PatternMaker from 'khartis/utils/pattern-maker';
import CategoryMixin from 'khartis/models/mapping/mixins/category';
/* global Em */

const ANGLES = [0, 45, 90, 135];

export default WrapperAbstract.extend({
  
  availableColorSets: function() {
    let categoricalScheme = CategoryMixin.Data.detect(this.get('obj')) && !this.get('obj.ordered'),
        master = this.get('obj.scale.diverging') ? Colorbrewer.diverging : (categoricalScheme ? Colorbrewer.categorical : Colorbrewer.sequential),
        classes = this.get('obj.scale.classes');
    
      return Object.keys(master).map( k => {
        
        let colors;
        
        if (CategoryMixin.Data.detect(this.get('obj'))) {
          colors = Colorbrewer.Composer.compose(
            k, 
            false,
            false, 
            Math.min(this.get('obj.rules').length, 8),
            0,
            categoricalScheme
          );
        } else {
          colors = Colorbrewer.Composer.compose(
            k, 
            this.get('obj.scale.diverging'),
            this.get('obj.visualization.reverse'), 
            this.get('obj.scale.classes'),
            this.get('obj.scale.classesBeforeBreak')
          );
        }
        
        return {
          colors: colors,
          key: k
        };
        
      }).filter( x => x.colors != null );
    
  }.property('obj.ordered', 'obj.visualization._defferedChangeIndicator', 'obj.scale._defferedChangeIndicator'),

  categoricalColorSet: function() {

    let master = Colorbrewer.categorical;

    return Object.keys(master).map( k => {
      
      let colors = Colorbrewer.Composer.compose(
        k, 
        false,
        false, 
        8,
        0,
        true
      );
      
      return {
        colors: colors,
        key: k
      };
      
    }).filter( x => x.colors != null );

  }.property(),

  availableColorSetsMap: function() {
    return this.get('availableColorSets').reduce( (o, c) => {
      o[c.key] = c.colors;
      return o;
    }, {});
  }.property('availableColorSets.[]'),

  categoricalColorSetMap: function() {
    return this.get('categoricalColorSet').reduce( (o, c) => {
      o[c.key] = c.colors;
      return o;
    }, {});
  }.property('categoricalColorSet.[]'),
  
  availablePatterns: function() {
    return ANGLES.map( (angle) => {
        return PatternMaker.Composer.build({
          angle: angle,
          stroke: 1,
          type: "lines"
        });
    });
  }.property('obj.scale._defferedChangeIndicator')
  
  
});
