export const Vector = function(x, y) {
	if (!(this instanceof Vector)) {
		return new Vector(x, y);
	}
	this.x = x || 0;
	this.y = y || 0;
};

Vector.fromArray = function (arr) {
	return new Vector(arr[0] || 0, arr[1] || 0);
};

Vector.fromPoints = function(ptA, ptB) {
  return new Vector(ptB[0] - ptA[0], ptB[1] - ptA[1]);
};

Vector.prototype.normal = function() {
  return new Vector(-this.y, this.x);
};

Vector.prototype.normalIntersection = function(origin, pt) {
  let dirD = this.equationD(origin),
      normalD = this.normal().equationD(pt);
  return normalD.intersection(dirD);
};

Vector.prototype.equationD = function(pt) {
  return new Line(this, pt);
};

Vector.prototype.magnitude = function() {
  return Math.sqrt(this.x*this.x + this.y*this.y);
};

Vector.prototype.scalarProduct = function(vect) {
  return this.x*vect.x + this.y*vect.y;
};

Vector.prototype.angle = function() {
  return Math.atan2(this.y, this.x);
};

Vector.prototype.coordinates = function() {
  return [this.x, this.y]
};

Vector.prototype.add = function(vect) {
  return new Vector(this.x+vect.x, this.y+vect.y);
};

Vector.prototype.scale = function(k) {
  return new Vector(this.x*k, this.y*k);
};

Vector.prototype.subtract = function(vect) {
  return new Vector(this.x-vect.x, this.y-vect.y);
};

Vector.prototype.unitary = function() {
  let m = this.magnitude();
  return new Vector(this.x/m, this.y/m);
};

Vector.prototype.orthoProject = function(ori, u, v) { //on supposé le repère orthonormé, u, v, vecteurs unitaires
  let oprime = this.subtract(ori),
      mo = oprime.magnitude(),
      mu = u.magnitude(),
      mv = v.magnitude(),
      teta = oprime.angle() - u.angle();
  return new Vector(mo*Math.cos(teta)/mu, mo*Math.sin(teta)/mv);
};

Vector.prototype.unOrthoProject = function(ori, u, v) {
  return ori.add(new Vector(u.x*this.x, u.y*this.x).add(new Vector(v.x*this.y, v.y*this.y)));
};