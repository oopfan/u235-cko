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
    self.luminanceIntegrationTime = ko.observable();
    self.redFrameCount = ko.observable();
    self.redExposure = ko.observable(calc.redExposure);
    self.redIntegrationTime = ko.observable();
    self.greenFrameCount = ko.observable();
    self.greenExposure = ko.observable(calc.greenExposure);
    self.greenIntegrationTime = ko.observable();
    self.blueFrameCount = ko.observable();
    self.blueExposure = ko.observable(calc.blueExposure);
    self.blueIntegrationTime = ko.observable();
    self.totalIntegrationTime = ko.observable();
    self.lblLuminance = ko.observable("Luminance");
    self.lblLuminanceBinning = ko.observable("1");
    self.lblRed = ko.observable("Red");
    self.lblGreen = ko.observable("Green");
    self.lblBlue = ko.observable("Blue");
    self.modeStatus = ko.computed(function() {
      return self.frameCountMode() === "common" ? true : undefined;
    });
    var updateAll = function() {
      if (calc.commonFrameCountMode) {
        self.redExposure(calc.redExposure.toFixed(1));
        self.greenExposure(calc.greenExposure.toFixed(1));
        self.blueExposure(calc.blueExposure.toFixed(1));
      }
      self.redFrameCount(calc.redFrameCount.toFixed(1));
      self.greenFrameCount(calc.greenFrameCount.toFixed(1));
      self.blueFrameCount(calc.blueFrameCount.toFixed(1));

      var lumTime = calc.luminanceFrameCount * calc.luminanceExposure / 60;
      var redTime = calc.redFrameCount * calc.redExposure / 60;
      var greenTime = calc.greenFrameCount * calc.greenExposure / 60;
      var blueTime = calc.blueFrameCount * calc.blueExposure / 60;
      var totalTime = (lumTime + redTime + greenTime + blueTime) / 60;

      self.luminanceIntegrationTime(lumTime.toFixed(1));
      self.redIntegrationTime(redTime.toFixed(1));
      self.greenIntegrationTime(greenTime.toFixed(1));
      self.blueIntegrationTime(blueTime.toFixed(1));
      self.totalIntegrationTime('Total: ' + totalTime.toFixed(1) + ' h');
    };
    self.rgbBinning.subscribe(function(newValue) {
      calc.rgbBinning = newValue;
      updateAll();
    });
    self.redBalance.subscribe(function(newValue) {
      calc.redBalance = validateNumber(newValue, 1);
      updateAll();
    });
    self.greenBalance.subscribe(function(newValue) {
      calc.greenBalance = validateNumber(newValue, 1);
      updateAll();
    });
    self.blueBalance.subscribe(function(newValue) {
      calc.blueBalance = validateNumber(newValue, 1);
      updateAll();
    });
    self.luminanceFrameCount.subscribe(function(newValue) {
      calc.luminanceFrameCount = validateNumber(newValue, 0);
      updateAll();
    });
    self.luminanceExposure.subscribe(function(newValue) {
      calc.luminanceExposure = validateNumber(newValue, 0);
      updateAll();
    });
    self.redExposure.subscribe(function(newValue) {
      calc.redExposure = validateNumber(newValue, 0);
      updateAll();
    });
    self.greenExposure.subscribe(function(newValue) {
      calc.greenExposure = validateNumber(newValue, 0);
      updateAll();
    });
    self.blueExposure.subscribe(function(newValue) {
      calc.blueExposure = validateNumber(newValue, 0);
      updateAll();
    });
    self.frameCountMode.subscribe(function(newValue) {
      calc.commonFrameCountMode = newValue === "common";
      updateAll();
    });
    updateAll();
  }

  function validateNumber(newValue, defaultValue) {
    var value = Number.parseFloat(newValue);
    if (Number.isNaN(value)) {
      return defaultValue;
    }
    return value;
  };

  LrgbExposureCalculator.prototype.dispose = function() {
    this.luminanceIntegrationTime.dispose();
    this.redIntegrationTime.dispose();
    this.greenIntegrationTime.dispose();
    this.blueIntegrationTime.dispose();
    this.totalIntegrationTime.dispose();
    this.modeStatus.dispose();
  };

  return { viewModel: LrgbExposureCalculator, template: templateMarkup };

});
