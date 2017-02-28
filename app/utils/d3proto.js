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
