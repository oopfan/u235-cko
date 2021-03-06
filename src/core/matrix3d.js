define(function() {
  function Matrix3D() {
    this._elem = [[0, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
  }
  init();
  return Matrix3D;

  function init() {
    Matrix3D.prototype = {
      getElement: function(row, column) {
        return this._elem[row][column];
      },
      setElement: function(row, column, value) {
        this._elem[row][column] = value;
      },
      setRotateX: function(angleRad) {
        var sina = Math.sin(angleRad);
        var cosa = Math.cos(angleRad);
        this._elem[1][1] = 1;
        this._elem[1][2] = 0;
        this._elem[1][3] = 0;
        this._elem[2][1] = 0;
        this._elem[2][2] = cosa;
        this._elem[2][3] = sina;
        this._elem[3][1] = 0;
        this._elem[3][2] = -sina;
        this._elem[3][3] = cosa;
        return this;
      },
      setRotateY: function(angleRad) {
        var sina = Math.sin(angleRad);
        var cosa = Math.cos(angleRad);
        this._elem[1][1] = cosa;
        this._elem[1][2] = 0;
        this._elem[1][3] = -sina;
        this._elem[2][1] = 0;
        this._elem[2][2] = 1;
        this._elem[2][3] = 0;
        this._elem[3][1] = sina;
        this._elem[3][2] = 0;
        this._elem[3][3] = cosa;
        return this;
      },
      setRotateZ: function(angleRad) {
        var sina = Math.sin(angleRad);
        var cosa = Math.cos(angleRad);
        this._elem[1][1] = cosa;
        this._elem[1][2] = sina;
        this._elem[1][3] = 0;
        this._elem[2][1] = -sina;
        this._elem[2][2] = cosa;
        this._elem[2][3] = 0;
        this._elem[3][1] = 0;
        this._elem[3][2] = 0;
        this._elem[3][3] = 1;
        return this;
      },
      matrixMultiply: function(rhs) {
        var a11 =
          this._elem[1][1] * rhs._elem[1][1] +
          this._elem[1][2] * rhs._elem[2][1] +
          this._elem[1][3] * rhs._elem[3][1];
        var a12 =
          this._elem[1][1] * rhs._elem[1][2] +
          this._elem[1][2] * rhs._elem[2][2] +
          this._elem[1][3] * rhs._elem[3][2];
        var a13 =
          this._elem[1][1] * rhs._elem[1][3] +
          this._elem[1][2] * rhs._elem[2][3] +
          this._elem[1][3] * rhs._elem[3][3];
        var a21 =
          this._elem[2][1] * rhs._elem[1][1] +
          this._elem[2][2] * rhs._elem[2][1] +
          this._elem[2][3] * rhs._elem[3][1];
        var a22 =
          this._elem[2][1] * rhs._elem[1][2] +
          this._elem[2][2] * rhs._elem[2][2] +
          this._elem[2][3] * rhs._elem[3][2];
        var a23 =
          this._elem[2][1] * rhs._elem[1][3] +
          this._elem[2][2] * rhs._elem[2][3] +
          this._elem[2][3] * rhs._elem[3][3];
        var a31 =
          this._elem[3][1] * rhs._elem[1][1] +
          this._elem[3][2] * rhs._elem[2][1] +
          this._elem[3][3] * rhs._elem[3][1];
        var a32 =
          this._elem[3][1] * rhs._elem[1][2] +
          this._elem[3][2] * rhs._elem[2][2] +
          this._elem[3][3] * rhs._elem[3][2];
        var a33 =
          this._elem[3][1] * rhs._elem[1][3] +
          this._elem[3][2] * rhs._elem[2][3] +
          this._elem[3][3] * rhs._elem[3][3];
        this._elem[1][1] = a11;
        this._elem[1][2] = a12;
        this._elem[1][3] = a13;
        this._elem[2][1] = a21;
        this._elem[2][2] = a22;
        this._elem[2][3] = a23;
        this._elem[3][1] = a31;
        this._elem[3][2] = a32;
        this._elem[3][3] = a33;
        return this;
      }
    };
  }
});
