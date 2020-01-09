define(['knockout'], function(ko) {
  function ObservatoryProfile() {
    this.name = ko.observable();
    this.bortleClass = ko.observable();
    this.skyBrightness = ko.observable();
  };
  return ObservatoryProfile;
});
