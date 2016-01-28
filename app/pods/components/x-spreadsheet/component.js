import Ember from 'ember';
import {DataStruct, RowStruct, ColumnStruct, CellStruct} from 'mapp/models/data';
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
    ["10", "11sf", "12", "4", "3", "9"],
    ["10", "11sdf", "12", "4", "3", "6"],
    ["10", "11sdf", "12", "4", "3", "9"],
    ["10", "11sdf", "12", "4", "3", "8"],
    ["10", "11df", "12", "4", "3", "7"],
    ["10", "11sdf", "12", "4", "3", "9"]
    
];

let DecoratedCell = Ember.Object.extend({
    cell: null,
    state: null,
    init() {
        this.set('state', {
            selected: false,
            edited: false,
            resizing: false
        });
    }
});

export default Ember.Component.extend({
    
    data: null,
    
    build: function() {
        this.set('data', DataStruct.createFromRawData(fakeData));
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
        
        $("body").on("click", () => {
            let cell = this.get('data').selectedCell();
            if (cell) {
                this.send('endSelectCell', cell);
            }
        });
        
    },
    
    actions: {
        
        startEditCell(cell) {
            this.get('data.rows').forEach(
                r => r.cells.forEach( c => c.set('state.sheet.edited', c == cell) )
            );
        },
        
        endEditCell(cell) {
            cell.set('state.sheet.edited', false);
        },
        
        startSelectCell(cell) {
            this.get('data.rows').forEach(
                r => r.cells.forEach( c => c.set('state.sheet.selected', c == cell) )
            );
        },
        
        endSelectCell(cell) {
            cell.set('state.sheet.selected', false);
        },
        
        addRow() {
            this.get('data').addRow();
        },
        
        addColumn() {
            this.get('data').addColumn();
        },
        
        onMouseEnterHeader(cell, component) {
        },
        
        onMouseLeaveHeader(cell, component) {
        },
        
        onApplyResize(width, cell) {
            cell.set('column.layout.sheet.width', width);
        },
        
        save() {
            window.localStorage.setItem('sheet-data', JSON.stringify(this.get('data').export()));
        },
        
        restore() {
            this.set('data', DataStruct.restore(JSON.parse(window.localStorage.getItem('sheet-data'))));
        }
        
    }
    
});