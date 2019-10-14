define(['vector3d', 'utility'], function(Vector3D, utility) {
  function Transformation(args, accumulator, memory) {
    var coordinates = memory.getValue(args.coordinates);
    var localTime = memory.getValue(args.localTime);
    var result = {};
    if (coordinates.frame === "Equ") {
      if (args.to === "Hor") {
        var vec = new Vector3D();
        vec.setPolar(coordinates.phi, coordinates.theta, 1);
        vec.matrixMultiply(localTime.matEquToHor);
        var polar = vec.getPolar();
        result.az = Math.PI - polar[0];
        result.alt = polar[1];
        result.origin = coordinates.origin;
        result.frame = args.to;
        result.epoch = coordinates.epoch;
        result.description = 'Coordinates AZ:"' + utility.formatDMS(result.az) + '" ALT:"' + utility.formatDMS(result.alt) + '" epoch:"' + result.epoch + '" origin:"' + result.origin + '" frame:"' + result.frame + '"';
        result.type = "Coordinates";
      }
      else {
        throw "Cannot handle this case yet";
      }
    }
    else {
      throw "Cannot handle this case yet";
    }
    accumulator.setValue(result);
  }
  return Transformation;
});
