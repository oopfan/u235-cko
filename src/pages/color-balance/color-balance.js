define(['knockout', 'utility', 'text!./color-balance.html'], function(ko, utility, templateMarkup) {

  function ColorBalance() {
    var self = this;
    self.redMeasurements = ko.observableArray();
    self.newRedMeasurement = new Measurement("R");
    self.saveNewRed = function () {
      var redMeasurement = new Measurement("R");
      redMeasurement.FluxUncorrected(self.newRedMeasurement.FluxUncorrected());
      redMeasurement.Altitude(self.newRedMeasurement.Altitude());
      self.redMeasurements.push(redMeasurement);
      self.newRedMeasurement.FluxUncorrected("");
      self.newRedMeasurement.Altitude("");
    };
    self.deleteRed = function (redMeasurement) {
      self.redMeasurements.remove(redMeasurement);
    };

    self.greenMeasurements = ko.observableArray();
    self.newGreenMeasurement = new Measurement("G");
    self.saveNewGreen = function () {
      var greenMeasurement = new Measurement("G");
      greenMeasurement.FluxUncorrected(self.newGreenMeasurement.FluxUncorrected());
      greenMeasurement.Altitude(self.newGreenMeasurement.Altitude());
      self.greenMeasurements.push(greenMeasurement);
      self.newGreenMeasurement.FluxUncorrected("");
      self.newGreenMeasurement.Altitude("");
    };
    self.deleteGreen = function (greenMeasurement) {
      self.greenMeasurements.remove(greenMeasurement);
    };

    self.blueMeasurements = ko.observableArray();
    self.newBlueMeasurement = new Measurement("B");
    self.saveNewBlue = function () {
      var blueMeasurement = new Measurement("B");
      blueMeasurement.FluxUncorrected(self.newBlueMeasurement.FluxUncorrected());
      blueMeasurement.Altitude(self.newBlueMeasurement.Altitude());
      self.blueMeasurements.push(blueMeasurement);
      self.newBlueMeasurement.FluxUncorrected("");
      self.newBlueMeasurement.Altitude("");
    };
    self.deleteBlue = function (blueMeasurement) {
      self.blueMeasurements.remove(blueMeasurement);
    };

    self.resultRedAverageFlux = ko.computed(function() {
      var avg = 0;
      var length = self.redMeasurements().length;
      if (length > 0) {
        var sum = 0;
        for (var index = 0; index < length; index++) {
          sum += self.redMeasurements()[index].FluxCorrected();
        }
        avg = sum / length;
      }
      return avg.toFixed(3);
    }, this);

    self.resultGreenAverageFlux = ko.computed(function() {
      var avg = 0;
      var length = self.greenMeasurements().length;
      if (length > 0) {
        var sum = 0;
        for (var index = 0; index < length; index++) {
          sum += self.greenMeasurements()[index].FluxCorrected();
        }
        avg = sum / length;
      }
      return avg.toFixed(3);
    }, this);

    self.resultBlueAverageFlux = ko.computed(function() {
      var avg = 0;
      var length = self.blueMeasurements().length;
      if (length > 0) {
        var sum = 0;
        for (var index = 0; index < length; index++) {
          sum += self.blueMeasurements()[index].FluxCorrected();
        }
        avg = sum / length;
      }
      return avg.toFixed(3);
    }, this);

    self.maxAverageFlux = ko.computed(function() {
      var max = Math.max(self.resultRedAverageFlux(), self.resultGreenAverageFlux(), self.resultBlueAverageFlux());
      return max;
    }, this);

    self.resultRedRatio = ko.computed(function() {
      var max = self.maxAverageFlux();
      var ratio = max / self.resultRedAverageFlux();
      return ratio.toFixed(2);
    }, this);

    self.resultGreenRatio = ko.computed(function() {
      var max = self.maxAverageFlux();
      var ratio = max / self.resultGreenAverageFlux();
      return ratio.toFixed(2);
    }, this);

    self.resultBlueRatio = ko.computed(function() {
      var max = self.maxAverageFlux();
      var ratio = max / self.resultBlueAverageFlux();
      return ratio.toFixed(2);
    }, this);
  }

  function Measurement(filterNormal) {
    this._filterNormal = filterNormal;
    this.FluxUncorrected = ko.observable("");
    this.Altitude = ko.observable("");
    this.Extinction = ko.computed(function() {
      return utility.calculateExtinction(90 - this.Altitude(), this._filterNormal);
    }, this);
    this.ExtinctionFmt = ko.computed(function() {
      return Number.parseFloat(this.Extinction()).toFixed(3);
    }, this);
    this.FluxCorrected = ko.computed(function() {
      return this.FluxUncorrected() * this.Extinction();
    }, this);
    this.FluxCorrectedFmt = ko.computed(function() {
      return Number.parseFloat(this.FluxCorrected()).toFixed(3);
    }, this);
  };

  ColorBalance.prototype.dispose = function() {
    this.resultRedAverageFlux.dispose();
    this.resultGreenAverageFlux.dispose();
    this.resultBlueAverageFlux.dispose();
    this.maxAverageFlux.dispose();
    this.resultRedRatio.dispose();
    this.resultGreenRatio.dispose();
    this.resultBlueRatio.dispose();
  };

  Measurement.prototype.dispose = function() {
    this.Extinction.dispose();
    this.ExtinctionFmt.dispose();
    this.FluxCorrected.dispose();
    this.FluxCorrectedFmt.dispose();
  };

  return { viewModel: ColorBalance, template: templateMarkup };
});
