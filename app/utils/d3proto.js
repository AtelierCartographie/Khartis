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
