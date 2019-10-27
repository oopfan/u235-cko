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
        var minExposure = Math.min(this._redExposure, this._greenExposure, this._blueExposure);
        var rFac = Math.pow(this._redBalance / this._redExposure * minExposure, 2);
        var gFac = Math.pow(this._greenBalance / this._greenExposure * minExposure, 2);
        var bFac = Math.pow(this._blueBalance / this._blueExposure * minExposure, 2);
        this._redFrameCount = rFac * rgbFlux / rRate / this._redExposure;
        this._greenFrameCount = gFac * rgbFlux / gRate / this._greenExposure;
        this._blueFrameCount = bFac * rgbFlux / bRate / this._blueExposure;
      }
    }
/*
    _updateDependencies: function() {
      var rgbExposure = this._luminanceExposure * 3 / this._rgbBinning / this._rgbBinning;
      var rExp = rgbExposure * this._redBalance;
      var gExp = rgbExposure * this._greenBalance;
      var bExp = rgbExposure * this._blueBalance;
      var rCnt = this._luminanceFrameCount / 3;
      var gCnt = this._luminanceFrameCount / 3;
      var bCnt = this._luminanceFrameCount / 3;

      if (this._commonFrameCountMode) {
        this._redExposure = rExp;
        this._greenExposure = gExp;
        this._blueExposure = bExp;
        this._redFrameCount = rCnt;
        this._greenFrameCount = gCnt;
        this._blueFrameCount = bCnt;
      }
      else {
        this._redFrameCount = this._redExposure > 0 ? (rExp * rCnt / this._redExposure) : 0;
        this._greenFrameCount = this._greenExposure > 0 ? (gExp * gCnt / this._greenExposure) : 0;
        this._blueFrameCount = this._blueExposure > 0 ? (bExp * bCnt / this._blueExposure) : 0;
      }
    }
    */
  };
  return LrgbExposureCalculator;
});
