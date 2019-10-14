define(['matrix3d', 'utility'], function(Matrix3D, utility) {
  function LocalTime(args, accumulator, memory) {
    var obsy = memory.getValue(args.observatory);
    var utc = memory.getValue(args.universalTime);
    var result = {};
    result.type = "LocalTime";
    var lmst = utc.gmst + Number.parseFloat(obsy.longitude) / 15;
    if (lmst < 0) {
        lmst += 24;
    }
    if (lmst >= 24) {
        lmst -= 24;
    }
    result.lmst = lmst;
    result.matEquToHor = calculateEquToHor(result.lmst, Number.parseFloat(obsy.latitude));
    result.description = 'Local Time LMST:"' + utility.formatHMS(utility.toRadians(result.lmst * 15)) + '"';
    accumulator.setValue(result);
  }
  return LocalTime;

  function calculateEquToHor(lmst, latitude) {
    var rotY = new Matrix3D();
    rotY.setRotateY((90 - latitude) / 180 * Math.PI);
    var rotZ = new Matrix3D();
    rotZ.setRotateZ(lmst / 12 * Math.PI);
    var mat = new Matrix3D();
    mat.matrixMultiply(rotY).matrixMultiply(rotZ);
    return mat;
  }
});
