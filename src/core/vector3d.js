define(function() {
  function Vector3D(x, y, z) {
    this._elem = [0, x, y, z];
  }
  init();
  return Vector3D;

  function init() {
    Vector3D.prototype = {
      getElement: function(row) {
        return this._elem[row];
      },
      setElement: function(row, value) {
        this._elem[row] = value;
      },
      setPolar: function(phi, theta, radius) {
        var rxy = radius * Math.cos(theta);
        this._elem[1] = rxy * Math.cos(phi);
        this._elem[2] = rxy * Math.sin(phi);
        this._elem[3] = radius * Math.sin(theta);
        return this;
      },
      getPolar: function() {
        var radius = this._getRadius();
        var phi = Math.atan2(this._elem[2], this._elem[1]);
        var theta = Math.asin(this._elem[3] / radius);
        return [phi, theta, radius];
      },
      getRadius: function() {
        return this._getRadius();
      },
      _getRadius: function() {
        return Math.sqrt(this._dotProduct(this));
      },
      dotProduct: function(vec) {
        return this._dotProduct(vec);
      },
      _dotProduct: function(vec) {
        return (
          this._elem[1] * vec._elem[1] +
          this._elem[2] * vec._elem[2] +
          this._elem[3] * vec._elem[3]
        );
      },
      getAngularSeparation: function(vec) {
        return Math.acos(Math.max(-1, Math.min(1, this._dotProduct(vec) /
          (this._getRadius() * vec._getRadius()))));
      },
      add: function(rhs) {
        this._elem[1] += rhs._elem[1];
        this._elem[2] += rhs._elem[2];
        this._elem[3] += rhs._elem[3];
        return this;
      },
      subtract: function(rhs) {
        this._elem[1] -= rhs._elem[1];
        this._elem[2] -= rhs._elem[2];
        this._elem[3] -= rhs._elem[3];
        return this;
      },
      scalarMultiply: function(scalar) {
        this._elem[1] *= scalar;
        this._elem[2] *= scalar;
        this._elem[3] *= scalar;
        return this;
      },
      crossProduct: function(rhs) {
        var x = this._elem[2] * rhs._elem[3] - this._elem[3] * rhs._elem[2];
        var y = this._elem[3] * rhs._elem[1] - this._elem[1] * rhs._elem[3];
        var z = this._elem[1] * rhs._elem[2] - this._elem[2] * rhs._elem[1];
        this._elem[1] = x;
        this._elem[2] = y;
        this._elem[3] = z;
        return this;
      },
      matrixMultiply: function(matrix3D) {
        var x =
          matrix3D._elem[1][1] * this._elem[1] +
          matrix3D._elem[1][2] * this._elem[2] +
          matrix3D._elem[1][3] * this._elem[3];
        var y =
          matrix3D._elem[2][1] * this._elem[1] +
          matrix3D._elem[2][2] * this._elem[2] +
          matrix3D._elem[2][3] * this._elem[3];
        var z =
          matrix3D._elem[3][1] * this._elem[1] +
          matrix3D._elem[3][2] * this._elem[2] +
          matrix3D._elem[3][3] * this._elem[3];
        this._elem[1] = x;
        this._elem[2] = y;
        this._elem[3] = z;
        return this;
      }
    };
  }
});
