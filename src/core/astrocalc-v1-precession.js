define(['vector3d', 'utility'], function(Vector3D, utility) {
  function Precession(args, accumulator, memory) {
    var coordinates = memory.getValue(args.coordinates);
    var universalTime = memory.getValue(args.universalTime);
    var result = {};
    if (coordinates.frame === 'Equ') {
      var vec = new Vector3D();
      vec.setPolar(coordinates.phi, coordinates.theta, 1);
      vec.matrixMultiply(universalTime.matEquToEcl);
      vec.matrixMultiply(universalTime.matPrecessToDate);
      vec.matrixMultiply(universalTime.matEclToEqu);
      var answer = vec.getPolar();
      result.phi = answer[0];
      if (result.phi < 0) {
        result.phi += 2 * Math.PI;
      }
      result.theta = answer[1];
      result.radius = coordinates.radius;
      result.origin = coordinates.origin;
      result.frame = coordinates.frame;
      result.epoch = universalTime.date + ' ' + universalTime.time;
      result.description = 'Coordinates RA:"' + utility.formatHMS(result.phi) + '" DEC:"' + utility.formatDMS(result.theta) + '" epoch:"' + result.epoch + '" origin:"' + result.origin + '" frame:"' + result.frame + '"';
      result.type = "Coordinates";
    }
    else {
      throw 'Can only precess equatorial coordinates';
    }
    accumulator.setValue(result);
  }
  return Precession;
});
