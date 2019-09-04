define(function() {
  function Timekeeper() {
    this._timeScale = 'UT1';
    this._date = 0;
    this._jd = 0;
    this._jd0 = 0;
    this._gmst = 0;
    this._gmst0 = 0;
    this._monthNameToNum = {
      'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
      'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
  }
  init();
  return Timekeeper;

  function init() {
    Timekeeper.prototype = {
      setTimeScale: function(value) {
        // expecting: "UT1" or "TT"
        this._timeScale = value;
      },
      getTimeScale: function() {
        return this._timeScale;
      },
      getDeltaT: function() {
        // Returns the number of seconds difference between Terrestrial Time and Universal Time.
        // This should be a function or table lookup with interpolation. Right now we will use
        // the value for June 20, 2016. delta T is a required adjustment for some calculations
        // that must use Terrrestrial Time like elliptical orbits for the planets. We leave it
        // up to the consumer to make the adjustment to the Julian Date if he sees that the
        // Time Scale is "UT1".
        return 70.213;
      },
      setDate: function(value) {
        this._date = value;
        this._calculateJD0FromDate();
        this._calculateJD();
        this._calculateGMST0();
        this._calculateGMST();
      },
      getDate: function() {
        return this._date;
      },
      setJD: function(value) {
        this._jd = value;
        this._calculateJD0FromJD();
        this._calculateDate();
        this._calculateGMST0();
        this._calculateGMST();
      },
      getJD: function() {
        return this._jd;
      },
      getJD0: function() {
        return this._jd0;
      },
      getGMST: function() {
        return this._gmst;
      },
      getGMST0: function() {
        return this._gmst0;
      },
      parseMicaDateTime: function(str) {
        // Sample input: "2016 Feb 29 23:02:24.0"
        var monthName = str.slice(5, 8);
        var monthNum = this._monthNameToNum[monthName];
        var year = parseInt(str.slice(0, 4));
        var day = parseInt(str.slice(9, 11));
        var hour = parseInt(str.slice(12, 14));
        var minute = parseInt(str.slice(15, 17));
        var second = parseFloat(str.slice(18));
        return new Date(
          Date.UTC(year, monthNum - 1, day, hour, minute, Math.trunc(second))
          );
      },
      parseMicaSiderealTime: function(str) {
        // Sample input: "22 13 57.2672"
        var hour = parseInt(str.slice(0, 2));
        var minute = parseInt(str.slice(3, 5));
        var second = parseFloat(str.slice(6));
        return hour + (minute + second / 60) / 60;
      },
      _calculateJD0FromDate: function() {
        var yp = this._date.getUTCFullYear();
        var mp = this._date.getUTCMonth() + 1;
        if (mp <= 2) {
          mp += 12;
          yp -= 1;
        }
        var jd0 = Math.trunc(36525 * yp / 100);
        jd0 += Math.trunc((306001 * (1 + mp)) / 10000);
        jd0 += this._date.getUTCDate() + 2 + Math.trunc(yp / 400);
        jd0 -= Math.trunc(yp / 100);
        this._jd0 = jd0 + 1720994.5;
      },
      _calculateJD0FromJD: function() {
        this._jd0 = Math.floor(this._jd + 0.5) - 0.5;
      },
      _calculateJD: function() {
        this._jd = this._jd0 +
          ((this._date.getUTCHours() + (this._date.getUTCMinutes() +
          (this._date.getUTCSeconds() + this._date.getUTCMilliseconds() /
          1000.0) / 60.0) / 60.0) / 24.0);
      },
      _calculateDate: function() {
        var JGREG = 15 + 31 * (10 + 12 * 1582);
        var julian = this._jd;
        var ja = Math.trunc(Math.floor(julian));
        var p = julian - Math.floor(julian);
        if (ja >= JGREG) {
          var jalpha = Math.trunc(((ja - 1867216) - 0.25) / 36524.25);
          ja += 1 + jalpha - Math.trunc(jalpha / 4);
        }
        var jb = ja + 1524;
        var jc = Math.trunc(6680.0 + ((jb - 2439870) - 122.1) / 365.25);
        var jdd = 365 * jc + Math.trunc(jc / 4);
        var je = Math.trunc((jb - jdd) / 30.6001);
        var day = jb - jdd - Math.trunc(30.6001 * je);
        var month = je - 1;
        if (month > 12) {
          month -= 12;
        }
        var year = jc - 4715;
        if (month > 2) {
          year -= 1;
        }
        if (year <= 0) {
          year -= 1;
        }
        this._date = new Date(
          Date.UTC(year, month - 1, day) +
          Math.trunc((p + 0.5) * 24 * 60 * 60 * 1000 + 0.5));
      },
      _calculateGMST0: function() {
        var tu = (this._jd0 - 2451545.0) / 36525.0;
        var T = (24110.54841 + tu * (8640184.812866 + tu * (0.093104 - tu * 6.2e-6))) /
                3600.0;
        T = T % 24;
        // We need the check below since 'tu' can go negative:
        if (T < 0) {
          T += 24;
        }
        this._gmst0 = T;
      },
      _calculateGMST: function() {
        var T = this._gmst0 +
          ((this._date.getUTCHours() + (this._date.getUTCMinutes() +
          (this._date.getUTCSeconds() + this._date.getUTCMilliseconds() / 1000.0) /
          60.0) / 60.0) * 1.00273790934);
        // But we don't need the check here since we know that 'gmst0' is positive
        // as well as UTC hours, minutes, seconds, and milliseconds.
        this._gmst = T % 24;
      }
    }
  }
});
