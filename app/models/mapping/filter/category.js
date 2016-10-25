import Ember from 'ember';
import Filter from './abstract';

const extractCellValue = function(cell) {
  return cell.get('corrected') ? cell.get('correctedValue') : cell.get('value');
};

let CategoryFilter = Filter.extend({

  excluded: [],

  deferredChange: Ember.debouncedObserver(
    'excluded',
    function() {
      this.notifyDefferedChange();
    }, 1),

  domain: function() {
    if (this.get('varCol')) {
      return this.get('varCol.body').reduce( (out, cell) => {
        out.indexOf(extractCellValue(cell)) === -1 && out.push(extractCellValue(cell));
        return out;
      }, []).map( k => ({value: k, included: this.get('excluded').indexOf(k) === -1}) );
    }
    return [];
  }.property('varCol', 'excluded'),

  toggleCategory(cat) {
    let idx = this.get('excluded').indexOf(cat.value);
    if (idx !== -1) {
      this.get('excluded').splice(idx, 1);
    } else {
      this.get('excluded').push(cat.value);
    }
    this.notifyPropertyChange('excluded');
  },

  selectAllCategory(mod) {
    if (mod) {
      this.set('excluded', []);
    } else {
      this.set('excluded', this.get('domain').map( d => d.value ) );
    }
  },

  filteredRows: function() {
    if (this.get('excluded') && this.get('varCol')) {
      return this.get('varCol.body')
        .filter( cell => this.get('excluded').indexOf(extractCellValue(cell)) === -1 )
        .map( cell => cell.get('row') );
    }
    return this.get('varCol.body').map( cell => cell.get('row') );
  }.property('excluded', 'varCol'),

  run(cell) {
    return this.get('filteredRows').indexOf(cell.get('row')) !== -1;
  },

  export(props) {
    return this._super(Object.assign({
      excluded: this.get('excluded')
    }, props))
  }
  
});

CategoryFilter.reopenClass({
  
  restore(json, refs = {}) {
    return this._super(json, refs, {
      excluded: json.excluded.slice(0)
    });
  }
});

export default CategoryFilter;
