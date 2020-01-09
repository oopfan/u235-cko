define(['knockout'], function(ko) {
  function TargetProfile() {
    this.name = ko.observable();
    this.surfaceBrightness = ko.observable();
  };
  return TargetProfile;
});
