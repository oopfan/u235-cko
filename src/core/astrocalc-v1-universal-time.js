define(['matrix3d', 'utility'], function(Matrix3D, utility) {
  function UniversalTime(args, accumulator) {
    var result = {};
    result.type = "UniversalTime";
    result.date = args.date;
    result.time = args.time;
    var dateParts = args.date.split('-').map(function(part) {
      return Number.parseFloat(part);
    });
    var timeParts = args.time.split(':').map(function(part) {
      return Number.parseFloat(part);
    });
    var year = dateParts[0];
    var month = dateParts[1];
    var day = dateParts[2];
    var hour = timeParts[0];
    var minute = timeParts[1];
    var second = timeParts[2];
    var date = new Date(Date.UTC(year, month-1, day, hour, minute, second));
    result.jd0 = CalculateJD0FromDate(date);
    result.jd = CalculateJD(date, result.jd0);
    result.gmst0 = CalculateGMST0(result.jd0);
    result.gmst = CalculateGMST(date, result.gmst0);
    var obliquity = calculateObliquityOfEcliptic(result.jd);
    result.matEquToEcl = new Matrix3D();
    result.matEquToEcl.setRotateX(obliquity);
    result.matEclToEqu = new Matrix3D();
    result.matEclToEqu.setRotateX(-obliquity);
    var precession = calculatePrecessionSinceJ2000(result.jd);
    result.matPrecessToDate = new Matrix3D();
    result.matPrecessToDate.setRotateZ(-precession);
    result.description = 'Universal Time "' + args.date + ' ' + args.time + '"' + ' JD:"' + result.jd.toFixed(5) + '"' + ' GMST:"' + utility.formatHMS(utility.toRadians(result.gmst * 15)) + '"';
    accumulator.setValue(result);

    function CalculateJD0FromDate(date) {
      var yp = date.getUTCFullYear();
      var mp = date.getUTCMonth() + 1;
      if (mp <= 2) {
        mp += 12;
        yp -= 1;
      }
      var jd0 = Math.trunc(36525 * yp / 100);
      jd0 += Math.trunc((306001 * (1 + mp)) / 10000);
      jd0 += date.getUTCDate() + 2 + Math.trunc(yp / 400);
      jd0 -= Math.trunc(yp / 100);
      jd0 += 1720994.5;
      return jd0;
    }

    function CalculateJD(date, jd0) {
      var jd = jd0 +
        ((date.getUTCHours() + (date.getUTCMinutes() +
        (date.getUTCSeconds() + date.getUTCMilliseconds() /
        1000.0) / 60.0) / 60.0) / 24.0);
      return jd;
    }

    function CalculateGMST0(jd0) {
      var tu = (jd0 - 2451545.0) / 36525.0;
      var T = (24110.54841 + tu * (8640184.812866 + tu * (0.093104 - tu * 6.2e-6))) /
              3600.0;
      T = T % 24;
      // We need the check below since 'tu' can go negative:
      if (T < 0) {
        T += 24;
      }
      return T;
    }

    function CalculateGMST(date, gmst0) {
      var T = gmst0 +
        ((date.getUTCHours() + (date.getUTCMinutes() +
        (date.getUTCSeconds() + date.getUTCMilliseconds() / 1000.0) /
        60.0) / 60.0) * 1.00273790934);
      // But we don't need the check here since we know that 'gmst0' is positive
      // as well as UTC hours, minutes, seconds, and milliseconds.
      return T % 24;
    }

    function calculateObliquityOfEcliptic(jd) {
      var obliquity = utility.toRadians(23.4393 - 3.563E-7 * (jd - 2451543.5));
      return obliquity;
    }

    function calculatePrecessionSinceJ2000(jd) {
      var precession = utility.toRadians(3.82394E-5 * (jd - 2451543.5));
      return precession;
    }
  }
  return UniversalTime;
});
