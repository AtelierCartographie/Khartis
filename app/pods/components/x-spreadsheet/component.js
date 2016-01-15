import Ember from 'ember';
/*global Em*/
/* global $ */

let fakeData = [
    
    ["Col 1", "Col 2", "Col 3"],
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["10", "11", "12"]
    
];

let Data = Ember.Object.extend({
    
    data: null,
    
    header: function() {
        return this.get('data')[0];
    }.property('data.[]'),
    
    body: function() {
        return this.get('data').slice(1);
    }.property('data.[]')
   
});

export default Ember.Component.extend({
    
    tagName: "div",
    
    data: Data.create({data: fakeData}),
    
    headers: null,
    
    editedCell: null,
    resizeHandleComponent: null,
    
    setup: function() {
        this.set('headers', Em.A());
    },
    
    didInsertElement: function() {
        
        this.fakeThead();
        
    },
    
    fakeThead: function() {
        
        this.set('headers', Em.A());
        
        this.$('table th').each((i, el) => {
            this.get('headers').push({content: el.innerHTML, refEl: el});
        });
        
    },
    
    actions: {
        
        startEditCell(cell) {
            this.set('editedCell', cell);
        },
        
        endEditCell(cell) {
            this.set('editedCell', null);
        },
        
        onHeaderOver() {
            console.log("over");
        },
        
        onMouseEnterHeader(headerComponent) {
            this.get('resizeHandleComponent').attachToHeader(headerComponent);
        },
        
        onMouseLeaveHeader(headerComponent) {
            this.get('resizeHandleComponent').detachFromHeader(headerComponent);
        },
        
        onResizeHandleReady(resizeHandleComponent) {
            this.set('resizeHandleComponent', resizeHandleComponent);
        }
        
    }
    
});