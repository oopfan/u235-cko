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
      var snrLum = SNR(this._luminanceExposure * lRate, 1, 1, this._luminanceFrameCount);
      var snrAvg = Math.sqrt(snrLum * snrLum / 3);

      if (this._commonFrameCountMode) {
        var rgbFrames = this._luminanceFrameCount / 3;
        this._redFrameCount = rgbFrames;
        this._greenFrameCount = rgbFrames;
        this._blueFrameCount = rgbFrames;

        this._redExposure = EXP(rgbFrames, this._rgbBinning, this._redBalance, snrAvg);
        this._greenExposure = EXP(rgbFrames, this._rgbBinning, this._greenBalance, snrAvg);
        this._blueExposure = EXP(rgbFrames, this._rgbBinning, this._blueBalance, snrAvg);
      }
      else {
        this._redFrameCount = FC(this._redExposure, this._rgbBinning, this._redBalance, snrAvg);
        this._greenFrameCount = FC(this._greenExposure, this._rgbBinning, this._greenBalance, snrAvg);
        this._blueFrameCount = FC(this._blueExposure, this._rgbBinning, this._blueBalance, snrAvg);
      }
    }
  };

  function SNR(exposure, binning, balance, frame_count) {
    return Math.sqrt(exposure * binning * binning / balance * frame_count);
  }

  function FC(exposure, binning, balance, snr) {
    return snr * snr * balance / (exposure * binning * binning);
  }

  function EXP(frame_count, binning, balance, snr) {
    return snr * snr * balance / (frame_count * binning * binning);
  }

  return LrgbExposureCalculator;
});
