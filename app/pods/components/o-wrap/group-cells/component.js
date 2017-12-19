import WrapperAbstract from '../-abstract/component';
import {Levenshtein} from '../../multi-value-input/component';
import {matcher as geoMatcher} from 'khartis/utils/geo-matcher';
import d3 from "npm:d3";
/* global Em */

export default WrapperAbstract.extend({

  basemap: null,

  correctedCells: null,

  init() {
    this._super();
    this.set('correctedCells', Em.A());
  },
  
  dictionary: function() {
    return this.get('basemap.dictionaryData');
  }.property('basemap'),

  idKey: function() {
    return this.get('basemap.mapConfig.dictionary.identifier');
  }.property('basemap'),

  nameKey: function() {
    
    let ks = [
      "name_ISO_"+this.get('i18n.locale').toUpperCase(),
      "name_"+this.get('i18n.locale').toUpperCase(),
      "Name",
      "name",
      "name_EN"
    ];
    
    for (let k of ks) {
      if (geoMatcher.keyCodes.indexOf(k) !== -1) {
        return k;
      }
    }

    return geoMatcher.keyCodes[0];

  }.property('basemap', 'i18n.locale'),

  groupedIncorrectCells: function() {
    return this.get('obj.incorrectCells').reduce( (arr, cell) => {
      let row = arr.find( x => x.get('cell.value') === cell.get('value'));
      if (!row) {
        arr.addObject(Ember.Object.create({
          cell: cell,
          siblings: Em.A()
        }));
      } else {
        row.get('siblings').addObject(cell);
      }
      return arr;
    }, Em.A());
  }.property('obj.incorrectCells.[]'),

  actions: {

    autoCorrect() {
      this.get('groupedIncorrectCells').forEach( cellO => {
        let suggestions = this.get('dictionary').map( r => {
          return {
            r,
            lv: Levenshtein(cellO.get('cell.value'), r.get(this.get('nameKey')))
          };
        })
        .sort((a,b) => d3.ascending(a.lv, b.lv));
        
        if (suggestions.length && !cellO.get('cell.correctedValue')) {
          [cellO.get('cell'), cellO.siblings].forEach( cell => cell.set('correctedValue', suggestions[0].r.get(this.get('idKey'))) );
          this.get('correctedCells').indexOf(cellO.get('cell')) === -1 && this.get('correctedCells').addObject(cellO.get('cell'));
        }
      });
    },

    manuallyEdited(cell) {
      this.get('correctedCells').indexOf(cell) !== -1 && this.get('correctedCells').removeObject(cell);
    },

    cancelAutoCorrect() {
      this.get('correctedCells').forEach( cell => {
        let group = this.get('groupedIncorrectCells').find( grp => grp.get('cell') == cell );
        [group.get('cell'), group.siblings].forEach( cell => cell.set('correctedValue', null) );
      });
      this.set('correctedCells', Em.A());
    }
  }
});
