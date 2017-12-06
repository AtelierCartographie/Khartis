import Ember from 'ember';
import {TolerentLevenshtein} from 'khartis/pods/components/multi-value-input/component';

export default Ember.Component.extend({

  classNames: ['map-selector'],

  filterText: null,

  queryMaps:Ember.computed('maps', 'maps.[]', 'filterText', function() {
    if (this.get('filterText') && this.get('filterText').length) {

      var levenshteined = this.get('maps').map( basemap => {

        let name = this.get('i18n').t(`basemap.${basemap.id}`).string,
            lv = name.split(/[\s']/).reduce( (m, part) => {
              return Math.min(m, TolerentLevenshtein(part, this.get('filterText')));
            }, 100);
        
        return {
          basemap, lv
        }

      });
      return levenshteined.filter( o => o.lv < 2 ).map( o => o.basemap );
    }
    return this.get('maps');
  }),

  actions: {
    select(map) {
      this.sendAction('onSelect', map)
    }
  }

});
