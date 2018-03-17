/**
 * Inspired by
 * https://github.com/susielu/d3-annotation/blob/master/src/Connector/type-elbow.js
 */
export default (ox, oy, tx, ty) => {

    let x1 = ox,
      x2 = tx,
      y1 = oy,
      y2 = ty;
  
    let data = [[x1, y1], [x2, y2]]
  
    let diffY = y2 - y1
    let diffX = x2 - x1
    let xe = x2 
    let ye = y2
    let opposite = y2 < y1 && x2 > x1 || x2 < x1 && y2 > y1 ? -1 : 1
  
    if (Math.abs(diffX) < Math.abs(diffY)) {
      xe = x2
      ye = y1 + diffX*opposite
    } else {
      ye = y2
      xe = x1 + diffY*opposite
    }
    
    data = [[x1, y1], [xe , ye], [x2, y2]]

    return data;
  }