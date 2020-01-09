define(["knockout", "snrcalc-datastore", "text!./snrcalc-calculator.html"], function(ko, datastore, template) {

  function SnrCalcCalculatorViewModel(route) {

    this.availableTargets = datastore.targetProfiles;
    this.selectedTarget = ko.observable();

    this.availableTelescopes = datastore.telescopeProfiles;
    this.selectedTelescope = ko.observable();

    this.availableCameras = datastore.cameraProfiles;
    this.selectedCamera = ko.observable();

    this.availableObservatories = datastore.observatoryProfiles;
    this.selectedObservatory = ko.observable();

    this.totalExposureHours = ko.observable('10');
    this.singleSubSeconds = ko.observable('120');

    this.totalExposureSeconds = ko.computed(function() {
      return this.totalExposureHours() * 3600;
    }, this);

    this.numberOfSubs = ko.computed(function() {
      return this.totalExposureSeconds() / this.singleSubSeconds();
    }, this);

    this.clearApertureEquivalent = ko.computed(function() {
      if (this.selectedTelescope()) {
        return this.selectedTelescope().clearApertureEquivalent();
      }
      else {
        return Number.NaN;
      }
    }, this);

    this.focalLength = ko.computed(function() {
      if (this.selectedTelescope()) {
        return this.selectedTelescope().focalLength();
      }
      else {
        return Number.NaN;
      }
    }, this);

    this.pixelSize = ko.computed(function() {
      if (this.selectedCamera()) {
        return this.selectedCamera().pixelSize();
      }
      else {
        return Number.NaN;
      }
    }, this);

    this.readNoise = ko.computed(function() {
      if (this.selectedCamera()) {
        return this.selectedCamera().readNoise();
      }
      else {
        return Number.NaN;
      }
    }, this);

    this.darkCurrent = ko.computed(function() {
      if (this.selectedCamera()) {
        return this.selectedCamera().darkCurrent();
      }
      else {
        return Number.NaN;
      }
    }, this);

    this.quantumEfficiency = ko.computed(function() {
      if (this.selectedCamera()) {
        return this.selectedCamera().quantumEfficiency();
      }
      else {
        return Number.NaN;
      }
    }, this);

    this.imageResolution = ko.computed(function() {
      if (this.selectedCamera() && this.selectedTelescope()) {
        return 206.3 * this.selectedCamera().pixelSize() / this.selectedTelescope().focalLength();
      }
      else {
        return Number.NaN;
      }
    }, this);

    this.pixelSurface = ko.computed(function() {
      return this.imageResolution() * this.imageResolution();
    }, this);

    this.bortleClass = ko.computed(function() {
      if (this.selectedObservatory()) {
        return this.selectedObservatory().bortleClass();
      }
      else {
        return Number.NaN;
      }
    }, this);

    this.skyBrightness = ko.computed(function() {
      if (this.selectedObservatory()) {
        return this.selectedObservatory().skyBrightness();
      }
      else {
        return Number.NaN;
      }
    }, this);

    this.targetBrightness = ko.computed(function() {
      if (this.selectedTarget()) {
        return this.selectedTarget().surfaceBrightness();
      }
      else {
        return Number.NaN;
      }
    }, this);

    this.skyElectronsPerSecond = ko.computed(function() {
      return this.clearApertureEquivalent() * 880000 / Math.pow(2.515, this.skyBrightness()) * this.pixelSurface() * this.quantumEfficiency() / 100;
    }, this);

    this.skyElectronsPerSub = ko.computed(function() {
      return this.skyElectronsPerSecond() * this.singleSubSeconds();
    }, this);

    this.skyNoise = ko.computed(function() {
      return Math.sqrt(this.skyElectronsPerSub());
    }, this);

    this.targetElectronsPerSecond = ko.computed(function() {
      return this.clearApertureEquivalent() * 880000 / Math.pow(2.515, this.targetBrightness()) * this.pixelSurface() * this.quantumEfficiency() / 100;
    }, this);

    this.targetElectronsPerSub = ko.computed(function() {
      return this.targetElectronsPerSecond() * this.singleSubSeconds();
    }, this);

    this.shotNoise = ko.computed(function() {
      return Math.sqrt(this.targetElectronsPerSub());
    }, this);

    this.darkCurrentPerSub = ko.computed(function() {
      return this.darkCurrent() * this.singleSubSeconds();
    }, this);

    this.darkNoise = ko.computed(function() {
      return Math.sqrt(this.darkCurrentPerSub());
    }, this);

    this.totalSignalPerSub = ko.computed(function() {
      return this.targetElectronsPerSub() + this.skyElectronsPerSub() + this.darkCurrentPerSub();
    }, this);

    this.totalNoisePerSub = ko.computed(function() {
      return Math.sqrt(this.readNoise() * this.readNoise() + this.shotNoise() * this.shotNoise() + this.skyNoise() * this.skyNoise() + this.darkNoise() * this.darkNoise());
    }, this);

    this.signalToNoisePerSub = ko.computed(function() {
      return this.targetElectronsPerSub() / this.totalNoisePerSub();
    }, this);

    this.totalSignalToNoiseOfStack = ko.computed(function() {
      return this.signalToNoisePerSub() * Math.sqrt(this.numberOfSubs());
    }, this);
  }

  return { viewModel: SnrCalcCalculatorViewModel, template: template };
});
