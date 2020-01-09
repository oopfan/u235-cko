define(['knockout'], function(ko) {
  function CameraProfile() {
    this.name = ko.observable();
    this.pixelSize = ko.observable();
    this.readNoise = ko.observable();
    this.darkCurrent = ko.observable();
    this.quantumEfficiency = ko.observable();
  };
  return CameraProfile;
});
