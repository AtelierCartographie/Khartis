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

let IdentifiableStruct = Ember.Object.extend({
   _uuid: null,
   init() {
       if (!this.get('_uuid')) {
           this.set('_uuid', `${new Date().getTime()}-${++IdentifiableStruct.__c}`);
       }
   } 
});

IdentifiableStruct.reopenClass({__c: 0});

let RowStruct = IdentifiableStruct.extend({
    header: null,
    cells: null,
    layout: null,
    init() {
        this._super();
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
    },
    export() {
        return {
            _uuid: this.get('_uuid'),
            header: this.get('header'),
            cells: this.get('cells').map( c => c.export() ),
            layout: this.get('layout')
        };
    }
});


RowStruct.reopenClass({
    restore: function(struct, refs) {
        var o = RowStruct.create({_uuid: struct._uuid});
        refs[struct._uuid] = o;
        o.setProperties({
            header: struct.header,
            layout: struct.layout,
            cells: struct.cells.map( x => CellStruct.restore(x, refs) )
        });
        return o;
    }
});

let ColumnStruct = IdentifiableStruct.extend({
    layout: null,
    meta: null,
    init() {
        this._super();
        this.set('meta', {
           type: "text" 
        });
        this.set('layout', {
           width: null
        });
    },
    export() {
        return {
            _uuid: this.get('_uuid'),
            layout: this.get('layout'),
            meta: this.get('meta')
        };
    }
});

ColumnStruct.reopenClass({
    restore: function(struct, refs) {
        var o = ColumnStruct.create({_uuid: struct._uuid});
        refs[struct._uuid] = o;
        o.setProperties({
            layout: struct.layout,
            meta: struct.meta
        });
        return o;
    }
});

let CellStruct = IdentifiableStruct.extend({
    column: null,
    row: null,
    value: null,
    state: null,
    init() {
        this._super();
        this.set('state', {
            edited: false,
            selected: false,
            resizing: false 
        });
    },
    export() {
        return {
            _uuid: this.get('_uuid'),
            column: `${this.get('column._uuid')}`,
            row: `${this.get('row._uuid')}`,
            value: this.get('value')
        };
    }
});

CellStruct.reopenClass({
    restore: function(struct, refs) {
        var o = CellStruct.create({_uuid: struct._uuid});
        refs[struct._uuid] = o;s
        o.setProperties({
            value: struct.value,
            column: refs[struct.column],
            row: refs[struct.row]
        });
        return o;
    }
});

let Struct = Ember.Object.extend({
    
    data: Em.A(),
    
    rows: null,
    columns: null,
    
    buildFromData: function() {
        
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
        
        this.setProperties({
            rows: rows,
            columns: columns
        });
        
    },
    
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
    },
    
    export() {
        return {
            data: this.get('data'),
            rows: this.get('rows').map( x => x.export() ),
            columns: this.get('columns').map( x => x.export() )
        };
    }
    
});

Struct.reopenClass({
    restore: function(struct, refs = {}) {
        var o = Struct.create();
        o.setProperties({
            data: struct.data,
            columns: struct.columns.map( x => ColumnStruct.restore(x, refs) ),
            rows: struct.rows.map( x => RowStruct.restore(x, refs) )
        });
        return o;
    }
})

export default Ember.Component.extend({
    
    tagName: "div",
    
    struct: Struct.create({data: fakeData}),
    
    resizable: null,
    
    buildStruct: function() {
        this.get('struct').buildFromData();
    }.on("init"),
    
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
        
        onStartResizeHeader(cell, component) {
            this.set('resizable', component);
        },
        
        onApplyResize(width, cell) {
            cell.set('column.layout.width', width);
        },
        
        onStopResize(component) {
            this.set('resizable', null);
        },
        
        save() {
            window.localStorage.setItem('sheet-data', JSON.stringify(this.get('struct').export()));
        },
        
        restore() {
            console.log(JSON.parse(window.localStorage.getItem('sheet-data')));
            this.set('struct', Struct.restore(JSON.parse(window.localStorage.getItem('sheet-data'))));
        }
        
    }
    
});