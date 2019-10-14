define(['astrocalc-v1-observatory', 'astrocalc-v1-store', 'astrocalc-v1-load', 'astrocalc-v1-universal-time',
        'astrocalc-v1-local-time', 'astrocalc-v1-coordinates', 'astrocalc-v1-precession', 'astrocalc-v1-transformation',
        'astrocalc-v1-clear-all'],
  function(Observatory, Store, Load, UniversalTime, LocalTime, Coordinates, Precession, Transformation, ClearAll) {

  function AstroCalcEngine(accumulator, memory) {
    this.Observatory = Observatory;
    this.UniversalTime = UniversalTime;
    this.LocalTime = LocalTime;
    this.Coordinates = Coordinates;
    this.Precession = Precession;
    this.Transformation = Transformation;
    this.Store = Store;
    this.Load = Load;
    this.ClearAll = ClearAll;

    this.submit = function(command, args) {
      new this[command](args, accumulator, memory);
    };
  }
  return AstroCalcEngine;
});
