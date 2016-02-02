import Ember from 'ember';
import {DataStruct, RowStruct, ColumnStruct, CellStruct} from 'mapp/models/data';
import d3 from 'd3';
/*global Em*/
/* global $ */

let fakeData = [
  ["Colonne 1"]
  /*["Col 1", "Col 2", "Col 3", "Col 4", "Col 5", "Col 6"],
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
   ["10", "11sdf", "12", "4", "3", "9"]*/

];

let mod = function (k, n) {
  return ((k %= n) < 0) ? k + n : k;
}

export default Ember.Component.extend({

  data: null,


  /**
   * Min width of the spreadsheet columns.
   * Bubbles down to h-resizer
   * @type {Number}
   */
  colsMinWidth: 100,

  build: function () {
    this.set('data', DataStruct.createFromRawData(fakeData));
  }.on("init"),

  didInsertElement() {

    let numbering = this.$(".sheet > .numbering"),
      dash = this.$(".sheet > .dash"),
      header = this.$(".sheet > .header");

    this.$(".sheet").scroll(function (e) {
      numbering.css({transform: `translateX(${$(this).scrollLeft()}px)`});
      header.css({transform: `translateY(${$(this).scrollTop()}px)`});
      dash.css({transform: `translate(${$(this).scrollLeft()}px, ${$(this).scrollTop()}px)`});
    });

    $("body").on("click.spreadsheet", () => {
      let cell = this.get('data').selectedCell();
      if (cell) {
        this.send('endSelectCell', cell);
      }
    });

    $(window).on("resize.spreadsheet", () => this.drawBackground());
    this.drawBackground();
  },
  
  willDestroyElement() {
      $("body").off("click.spreadsheet");
      $(window).off("resize.spreadsheet");
  },

  onDatachange: function () {
    Ember.run.later(this, this.drawBackground);
  }.observes('data.rows.[]', 'data.columns.[]'),
  
  unselectCell: function() {
      
      
  },

  drawBackground: function () {

    if (this.$()) {

      let el = this.$('.background'),
        d3l = d3.select(el[0]);

      let scrollBarSize = this.$('.sheet')[0].offsetHeight - this.$('.sheet')[0].clientHeight;
      d3l.attr('width', this.$('.sheet')[0].scrollWidth - scrollBarSize);
      d3l.attr('height', this.$('.sheet')[0].scrollHeight - scrollBarSize);

      let fill = function*(x, max, step) {
        while (x < max) {
          x += step;
          yield step;
        }
      }

      let rows = [this.$(".header > .row").height()]
        .concat($.makeArray(this.$(".body > .row")).map((el) => $(el).height()))

      rows = rows.concat([...fill(rows.reduce((r, v) => r + v, 0), el.height(), 30)]);

      d3.select(el[0]).selectAll("line.row")
        .data(rows)
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("x2", "100%")
        .attr("y1", (d, i) => rows.slice(0, i + 1).reduce((r, v) => r + v, 0) - 1)
        .attr("y2", (d, i) => rows.slice(0, i + 1).reduce((r, v) => r + v, 0) - 1)
        .classed("row", true);

      let columns = [this.$('.dash').width()]
        .concat($.makeArray(this.$(".header > .row:first-child > .cell")).map( (el) => $(el).outerWidth() ));

      columns = columns.concat([...fill(columns.reduce((r, v) => r + v, 0), el.width(), 160)]);

      let layout = (lines) => {
        lines
          .attr("x1", (d, i) => columns.slice(0, i + 1).reduce((r, v) => r + v, 0) - 1)
          .attr("x2", (d, i) => columns.slice(0, i + 1).reduce((r, v) => r + v, 0) - 1)
          .attr("y1", 0)
          .attr("y2", "100%")
          .classed("column", true);
      };

      let lines = d3.select(el[0]).selectAll("line.column");
      layout(lines);
      lines = lines.data(columns)
        .enter()
        .append("line");
      layout(lines);
    }

  },

  actions: {

    startEditCell(cell) {
      this.get('data.rows').forEach(
        r => r.cells.forEach(c => c.set('state.sheet.edited', c == cell))
      );
    },

    endEditCell(cell) {
      cell.set('state.sheet.edited', false);
    },

    startSelectCell(cell) {
      this.get('data.rows').forEach(
        r => r.cells.forEach(c => c.set('state.sheet.selected', c == cell))
      );
    },

    cycleCellSelection(cell, shift) {
      let colIndex = cell.index(),
        rowIndex = this.get('data.rows').indexOf(cell.row),
        absIndex = rowIndex * this.get('data.columns').length + colIndex,
        nextAbsIndex = mod(absIndex + shift, this.get('data').size());

      this.send('startSelectCell', this.get('data').getCellAt(
        Math.floor(nextAbsIndex / this.get('data.columns').length),
          nextAbsIndex % this.get('data.columns').length
        )
      );
    },

    moveCellSelection(cell, row, col) {

      let rowIndex = this.get('data.rows').indexOf(cell.row) + row,
        colIndex = cell.index() + col;

      rowIndex = Math.max(0, Math.min(this.get('data.rows').length - 1, rowIndex));
      colIndex = Math.max(0, Math.min(this.get('data.columns').length - 1, colIndex));

      this.send('startSelectCell', this.get('data').getCellAt(rowIndex, colIndex));

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
      this.drawBackground();
    },

    save() {
      window.localStorage.setItem('sheet-data', JSON.stringify(this.get('data').export()));
    },

    restore() {
      this.set('data', DataStruct.restore(JSON.parse(window.localStorage.getItem('sheet-data'))));
    },

    openImport(url) {
      this.sendAction('navigateTo', "import");
    }

  }

});
