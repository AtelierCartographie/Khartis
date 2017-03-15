import d3 from 'npm:d3';

d3.selection.prototype.enterUpdate = function({enter, update, exit, removeOnExit = true}) {

  let enterSel;
  if (enter) {
    enterSel = enter(this.enter());
  }

  if (update) {
    enterSel && update(enterSel);
    update(this);
  }

  if (exit) {
    exit(this.exit());
  } else if (removeOnExit) {
    this.exit().remove();
  }

  return this;
  
};

d3.selection.prototype.nodes = function(){
   var nodes = new Array(this.size()), i = -1;
   this.each(function() { nodes[++i] = this; });
   return nodes;
 }


d3.selection.prototype.eachWithArgs = function(callback, ...args) {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.apply(node, args.concat([node.__data__, i, group]));
    }
  }

  return this;
}
