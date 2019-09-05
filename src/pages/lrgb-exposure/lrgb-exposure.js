define(['knockout', 'lrgb-exposure-calculator', 'text!./lrgb-exposure.html'], function(ko, Calculator, templateMarkup) {

  var calc = new Calculator();
  calc.rgbBinning = 2;
  calc.redBalance = 1.0;
  calc.greenBalance = 1.0;
  calc.blueBalance = 1.0;
  calc.luminanceFrameCount = 40;
  calc.luminanceExposure = 60;
  calc.redExposure = 60;
  calc.greenExposure = 60;
  calc.blueExposure = 60;
  calc.commonFrameCountMode = true;

  function LrgbExposureCalculator(params) {
    var self = this;
    self.frameCountMode = ko.observable(calc.commonFrameCountMode ? "common" : "variable");
    self.rgbBinning = ko.observable(calc.rgbBinning);
    self.redBalance = ko.observable(calc.redBalance);
    self.greenBalance = ko.observable(calc.greenBalance);
    self.blueBalance = ko.observable(calc.blueBalance);
    self.luminanceFrameCount = ko.observable(calc.luminanceFrameCount);
    self.luminanceExposure = ko.observable(calc.luminanceExposure);
    self.redFrameCount = ko.observable();
    self.redExposure = ko.observable(calc.redExposure);
    self.greenFrameCount = ko.observable();
    self.greenExposure = ko.observable(calc.greenExposure);
    self.blueFrameCount = ko.observable();
    self.blueExposure = ko.observable(calc.blueExposure);
    self.lblLuminance = ko.observable("Luminance"),
    self.lblLuminanceBinning = ko.observable("1"),
    self.lblRed = ko.observable("Red"),
    self.lblGreen = ko.observable("Green"),
    self.lblBlue = ko.observable("Blue")
    self.luminanceIntegrationTime = ko.computed(function() {
      var time = self.luminanceFrameCount() * self.luminanceExposure() / 60;
      return time.toFixed(1);
    });
    self.redIntegrationTime = ko.computed(function() {
      var time = self.redFrameCount() * self.redExposure() / 60;
      return time.toFixed(1);
    });
    self.greenIntegrationTime = ko.computed(function() {
      var time = self.greenFrameCount() * self.greenExposure() / 60;
      return time.toFixed(1);
    });
    self.blueIntegrationTime = ko.computed(function() {
      var time = self.blueFrameCount() * self.blueExposure() / 60;
      return time.toFixed(1);
    });
    self.totalIntegrationTime = ko.computed(function() {
      var time = (self.luminanceFrameCount() * self.luminanceExposure() + self.redFrameCount() * self.redExposure() + self.greenFrameCount() * self.greenExposure() + self.blueFrameCount() * self.blueExposure()) / 3600;
      return "Total: " + time.toFixed(1) + " h";
    });
    self.modeStatus = ko.computed(function() {
      return self.frameCountMode() === "common" ? true : undefined;
    });
    var updateAll = function() {
      if (calc.commonFrameCountMode) {
        self.redFrameCount(calc.luminanceFrameCount);
        self.greenFrameCount(calc.luminanceFrameCount);
        self.blueFrameCount(calc.luminanceFrameCount);
        self.redExposure(calc.redExposure.toFixed(1));
        self.greenExposure(calc.greenExposure.toFixed(1));
        self.blueExposure(calc.blueExposure.toFixed(1));
      }
      else {
        self.redFrameCount(calc.redFrameCount.toFixed(1));
        self.greenFrameCount(calc.greenFrameCount.toFixed(1));
        self.blueFrameCount(calc.blueFrameCount.toFixed(1));
      }
    };
    self.rgbBinning.subscribe(function(newValue) {
      calc.rgbBinning = newValue;
      updateAll();
    });
    self.redBalance.subscribe(function(newValue) {
      calc.redBalance = newValue;
      updateAll();
    });
    self.greenBalance.subscribe(function(newValue) {
      calc.greenBalance = newValue;
      updateAll();
    });
    self.blueBalance.subscribe(function(newValue) {
      calc.blueBalance = newValue;
      updateAll();
    });
    self.luminanceFrameCount.subscribe(function(newValue) {
      calc.luminanceFrameCount = newValue;
      updateAll();
    });
    self.luminanceExposure.subscribe(function(newValue) {
      calc.luminanceExposure = newValue;
      updateAll();
    });
    self.redExposure.subscribe(function(newValue) {
      calc.redExposure = newValue;
      updateAll();
    });
    self.greenExposure.subscribe(function(newValue) {
      calc.greenExposure = newValue;
      updateAll();
    });
    self.blueExposure.subscribe(function(newValue) {
      calc.blueExposure = newValue;
      updateAll();
    });
    self.frameCountMode.subscribe(function(newValue) {
      calc.commonFrameCountMode = newValue === "common";
      updateAll();
    });
    updateAll();
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  LrgbExposureCalculator.prototype.dispose = function() { };

  return { viewModel: LrgbExposureCalculator, template: templateMarkup };

});
