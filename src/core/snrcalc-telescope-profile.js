define(['knockout'], function(ko) {
  function TelescopeProfile() {
    this.name = ko.observable();
    this.aperture = ko.observable();
    this.focalLength = ko.observable();
    this.centralObstruction = ko.observable();
    this.opticalElements = ko.observableArray();
    this.totalLosses = ko.computed(function() {
      return this.opticalElements().reduce(function(accumulator, currentValue) {
        return accumulator * currentValue.reflectanceTransmittance();
      }, 1);
    }, this);
    this.clearApertureEquivalent = ko.computed(function() {
      return (this.aperture() * this.aperture() - this.centralObstruction() * this.centralObstruction()) * Math.PI * this.totalLosses() / 400;
    }, this);
  };
  return TelescopeProfile;
});
