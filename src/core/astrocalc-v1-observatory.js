define(function() {
  function Observatory(args, accumulator) {
    var result = {};
    result.type = "Observatory";
    result.description = 'Observatory "' + args.name + '" latitude:"' + args.latitude.toFixed(5) + '" longitude:"' + args.longitude.toFixed(5) + '"';
    result.name = args.name;
    result.latitude = args.latitude;
    result.longitude = args.longitude;
    accumulator.setValue(result);
  }
  return Observatory;
});
