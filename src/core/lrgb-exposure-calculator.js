define(function() {

  var LrgbExposureCalculator = function() {
    this._redBalance = null;
    this._greenBalance = null;
    this._blueBalance = null;
    this._rgbBinning = null;
    this._luminanceFrameCount = null;
    this._luminanceExposure = null;
    this._commonFrameCountMode = true;
    this._updateDependencies();
  }

  LrgbExposureCalculator.prototype = {
    get redBalance() {
      return this._redBalance;
    },
    set redBalance(value) {
      this._redBalance = value;
      this._updateDependencies();
    },

    get greenBalance() {
      return this._greenBalance;
    },
    set greenBalance(value) {
      this._greenBalance = value;
      this._updateDependencies();
    },

    get blueBalance() {
      return this._blueBalance;
    },
    set blueBalance(value) {
      this._blueBalance = value;
      this._updateDependencies();
    },

    get rgbBinning() {
      return this._rgbBinning;
    },
    set rgbBinning(value) {
      this._rgbBinning = value;
      this._updateDependencies();
    },

    get commonFrameCountMode() {
      return this._commonFrameCountMode;
    },
    set commonFrameCountMode(value) {
      this._commonFrameCountMode = value;
      this._updateDependencies();
    },

    get luminanceFrameCount() {
      return this._luminanceFrameCount;
    },
    set luminanceFrameCount(value) {
      this._luminanceFrameCount = value;
      this._updateDependencies();
    },

    get luminanceExposure() {
      return this._luminanceExposure;
    },
    set luminanceExposure(value) {
      this._luminanceExposure = value;
      this._updateDependencies();
    },

    get redFrameCount() {
      return this._redFrameCount;
    },
    get greenFrameCount() {
      return this._greenFrameCount;
    },
    get blueFrameCount() {
      return this._blueFrameCount;
    },

    get redExposure() {
      return this._redExposure;
    },
    set redExposure(value) {
      if (!this._commonFrameCountMode) {
        this._redExposure = value;
        this._updateDependencies();
      }
    },

    get greenExposure() {
      return this._greenExposure;
    },
    set greenExposure(value) {
      if (!this._commonFrameCountMode) {
        this._greenExposure = value;
        this._updateDependencies();
      }
    },

    get blueExposure() {
      return this._blueExposure;
    },
    set blueExposure(value) {
      if (!this._commonFrameCountMode) {
        this._blueExposure = value;
        this._updateDependencies();
      }
    },

    _updateDependencies: function() {
      var rRate = 1 / this._redBalance;
      var gRate = 1 / this._greenBalance;
      var bRate = 1 / this._blueBalance;
      var lRate = rRate + gRate + bRate;
      var lFlux = lRate * this._luminanceExposure * this._luminanceFrameCount;
      var rgbFlux = lFlux / 3 / this._rgbBinning / this._rgbBinning;

      if (this._commonFrameCountMode) {
        var rgbFrames = this._luminanceFrameCount / 3;
        this._redExposure = rgbFlux / rRate / rgbFrames;
        this._greenExposure = rgbFlux / gRate / rgbFrames;
        this._blueExposure = rgbFlux / bRate / rgbFrames;
        this._redFrameCount = rgbFrames;
        this._greenFrameCount = rgbFrames;
        this._blueFrameCount = rgbFrames;
      }
      else {
        var read_noise = 5;   // Any value will do
        var snrRed = SNR(this._redExposure, this._rgbBinning, this._redBalance, read_noise, this._luminanceFrameCount / 3);
        var snrGreen = SNR(this._greenExposure, this._rgbBinning, this._greenBalance, read_noise, this._luminanceFrameCount / 3);
        var snrBlue = SNR(this._blueExposure, this._rgbBinning, this._blueBalance, read_noise, this._luminanceFrameCount / 3);
        var snrLum = Math.sqrt(snrRed * snrRed + snrGreen * snrGreen + snrBlue * snrBlue);
        var snrAvg = Math.sqrt(snrLum * snrLum / 3);
        //console.log("snrRed:", snrRed);
        //console.log("snrGreen:", snrGreen);
        //console.log("snrBlue:", snrBlue);
        //console.log("snrLum:", snrLum);
        //console.log("snrAvg:", snrAvg);
        var fcRed = FC(this._redExposure, this._rgbBinning, this._redBalance, read_noise, snrAvg);
        var fcGreen = FC(this._greenExposure, this._rgbBinning, this._greenBalance, read_noise, snrAvg);
        var fcBlue = FC(this._blueExposure, this._rgbBinning, this._blueBalance, read_noise, snrAvg);
        //console.log("fcRed:", fcRed);
        //console.log("fcGreen:", fcGreen);
        //console.log("fcBlue:", fcBlue);
        this._redFrameCount = fcRed;
        this._greenFrameCount = fcGreen;
        this._blueFrameCount = fcBlue;
      }
    }
  };

  function SNR(exposure, binning, balance, read_noise, frame_count) {
    return (exposure * binning * binning) / (balance * read_noise) * Math.sqrt(frame_count);
  }

  function FC(exposure, binning, balance, read_noise, snr) {
    return Math.pow(snr * (balance * read_noise) / (exposure * binning * binning), 2);
  }

  return LrgbExposureCalculator;
});
