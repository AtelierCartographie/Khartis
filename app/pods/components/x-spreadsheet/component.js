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

let Struct = Ember.Object.extend({
    
    data: null,
    
    rows: function() {
        return this.get('data').map( (r, i) => { 
            return Ember.Object.create({
                header: i === 0,
                cells: r.map ( (c, j) => {
                    return Ember.Object.create({
                        index: j,
                        value: c,
                        state: {
                            edited: false,
                            selected: false,
                            resizing: false 
                        },
                        layout: {}
                    })
                })
            });
        });
    }.property('data'),
    
    header: function() {
        return this.get('rows')[0];
    }.property('rows.[]'),
    
    body: function() {
        return this.get('rows').slice(1);
    }.property('rows.[]')
   
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
            this.get('struct.rows').forEach( r => r.cells.forEach( c => c.set('edited', c == cell) ) );
        },
        
        endEditCell(cell) {
            cell.set('edited', false);
        },
        
        onMouseEnterHeader(cell, component) {
        },
        
        onMouseLeaveHeader(cell, component) {
        },
        
        onApplyResize(width, cell) {
            let cellIndex = cell.get('index');
            this.get('struct.rows').forEach( r => {
                r.cells.forEach( c => {
                    if (c.get('index') === cellIndex) {
                        c.set('layout.width', width);
                    }
                });
            });
            this.set('resizable', null);
        },
        
        onStartResizeHeader(cell, component) {
            this.set('resizable', component);
        }
        
    }
    
});