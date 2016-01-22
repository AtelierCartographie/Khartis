import Ember from 'ember';
import d3 from 'd3';
/*global Em*/
/* global $ */

let fakeData = [
    
    ["Col 1", "Col 2", "Col 3", "Col 4", "Col 5", "Col 6"],
    ["1", "2", "3", "4", "3", "1"],
    ["4", "5", "6", "3", "4", "2"],
    ["7", "8", "9", "1", "2", "3"],
    ["10", "11", "12", "4", "3", "4"],
    ["10", "11", "12", "4", "3", "5"],
    ["10", "11", "12", "4", "3", "9"],
    ["10", "11", "12", "4", "3", "6"],
    ["10", "11", "12", "4", "3", "9"],
    ["10", "11", "12", "4", "3", "8"],
    ["10", "11", "12", "4", "3", "7"],
    ["10", "11", "12", "4", "3", "9"]
    
];

let RowStruct = Ember.Object.extend({
    header: null,
    cells: null,
    layout: null,
    init() {
        this.set('layout', {
           height: null 
        });
    },
    emptyCopy() {
        var row = RowStruct.create();
        row.setProperties({
            header: this.get('header'),
            cells: this.get('cells').map( (c, i) => {
                return CellStruct.create({
                    column: c.get('column'),
                    row: row
                })
            })
        });
        return row;
    }
});

let ColumnStruct = Ember.Object.extend({
    layout: null,
    meta: null,
    init() {
        this.set('meta', {
           type: "text" 
        });
        this.set('layout', {
           width: null 
        });
    }
});

let CellStruct = Ember.Object.extend({
    column: null,
    row: null,
    value: null,
    state: null,
    init() {
        this.set('state', {
            edited: false,
            selected: false,
            resizing: false 
        });
    }
});

let Struct = Ember.Object.extend({
    
    data: Em.A(),
    
    rows: null,
    columns: null,
    
    dataChange: function() {
        
        let columns = [],
            rows = this.get('data').map( (r, i) => {
                let row = RowStruct.create();
                row.setProperties({
                    header: i === 0,
                    cells: r.map ( (c, j) => {
                        return CellStruct.create({
                            column: columns[j] ? columns[j] : (columns[j] = ColumnStruct.create()),
                            row: row,
                            value: c
                        });
                    })
                });
                return row;
            });
        
        this.set('rows', rows);
        this.set('columns', columns);
        
    }.observes('data').on('init'),
    
    header: function() {
        return this.get('rows')[0];
    }.property('rows.[]'),
    
    body: function() {
        console.log("change");
        return this.get('rows').slice(1);
    }.property('rows.[]'),
    
    selectedCell: function() {
        for (let row of this.get('rows')) {
            for (let cell of row.get('cells')) {
                if (cell.get('state.selected')) {
                    return cell;
                }
            }       
        }
        return null;
    },
    
    addRow() {
        let selectedCell = this.selectedCell(),
            shift = selectedCell ? 0:1,
            row = selectedCell ? selectedCell.get('row') : this.get('rows')[this.get('rows.length') - 1],
            index = this.get('rows').indexOf(row);
            
        this.get('rows').insertAt(index + shift, row.emptyCopy());
    },
    
    addColumn() {
        let selectedCell = this.selectedCell(),
            shift = selectedCell ? 0:1,
            index = selectedCell ? this.get('columns').indexOf(selectedCell.get('column')) : this.get('columns.length') - 1,
            column = ColumnStruct.create();
        
        this.get('columns').insertAt(index + shift, column);
        this.get('rows').forEach( r => {
            r.get('cells').insertAt(
                index + shift,
                CellStruct.create({
                    column: column,
                    row: r
                })
            );
        });
    }
   
});

export default Ember.Component.extend({
    
    tagName: "div",
    
    struct: Struct.create({data: fakeData}),
    
    resizable: null,
    
    didInsertElement() {
        
        let numbering = this.$(".sheet > .numbering"),
            dash = this.$(".sheet > .dash"),
            header = this.$(".sheet > .header");
        
        this.$(".sheet").scroll(function(e) {
            numbering.css({transform: `translateX(${$(this).scrollLeft()}px)`});
            header.css({transform: `translateY(${$(this).scrollTop()}px)`});
            dash.css({transform: `translate(${$(this).scrollLeft()}px, ${$(this).scrollTop()}px)`});
        });
        
    },
    
    actions: {
        
        startEditCell(cell) {
            this.get('struct.rows').forEach(
                r => r.cells.forEach( c => c.set('state.edited', c == cell) )
            );
        },
        
        endEditCell(cell) {
            cell.set('state.edited', false);
        },
        
        startSelectCell(cell) {
            this.get('struct.rows').forEach(
                r => r.cells.forEach( c => c.set('state.selected', c == cell) )
            );
        },
        
        endSelectCell(cell) {
            cell.set('state.selected', false);
        },
        
        addRow() {
            this.get('struct').addRow();
        },
        
        addColumn() {
            this.get('struct').addColumn();
        },
        
        onMouseEnterHeader(cell, component) {
        },
        
        onMouseLeaveHeader(cell, component) {
        },
        
        onApplyResize(width, cell) {
            cell.set('column.layout.width', width);
            this.set('resizable', null);
        },
        
        onStartResizeHeader(cell, component) {
            this.set('resizable', component);
        }
        
    }
    
});