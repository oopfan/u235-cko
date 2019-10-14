define(['utility'], function(utility) {
  function Coordinates(args, accumulator) {
    var result = {};

    if ("ra" in args && "dec" in args) {
      result.phi = utility.parseHMS(args.ra);
      result.theta = utility.parseDMS(args.dec);
      result.origin = "Geo";
      result.frame = "Equ";
      result.epoch = "J2000";
      result.description = 'Coordinates RA:"' + args.ra + '" DEC:"' + args.dec + '" epoch:"' + result.epoch + '" origin:"' + result.origin + '" frame:"' + result.frame + '"';
    }
    else if ("az" in args && "alt" in args) {
      result.phi = utility.parseDMS(args.az);
      result.theta = utility.parseDMS(args.alt);
      result.origin = "Geo";
      result.frame = "Hor";
      result.epoch = "Now";
      result.description = 'Coordinates AZ:"' + args.az + '" ALT:"' + args.alt + '" epoch:"' + result.epoch + '" origin:"' + result.origin + '" frame:"' + result.frame + '"';
    }
    else {
      throw "Coordinates constructor expected (ra, dec) or (az, alt), received neither.";
    }

    result.radius = ("radius" in args) ? Number.parseFloat(args.radius.toString()) : 1e99;
    result.type = "Coordinates";

    accumulator.setValue(result);
  }
  return Coordinates;
});
