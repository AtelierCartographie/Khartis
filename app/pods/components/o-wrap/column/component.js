import WrapperAbstract from '../-abstract/component';
/* global Em */

export default WrapperAbstract.extend({

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
  }.property('obj.incorrectCells.[]')
  
});
