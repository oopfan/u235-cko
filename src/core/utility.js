define(function() {
  return {
      isFunction: isFunction,
      isObject: isObject,
      toRadians: toRadians,
      toDegrees: toDegrees,
      calculateObliquityOfEcliptic: calculateObliquityOfEcliptic,
      calculatePrecessionSinceJ2000: calculatePrecessionSinceJ2000,
      formatHMS: formatHMS,
      formatDMS: formatDMS,
      parseHMS: parseHMS,
      parseDMS: parseDMS,
      getCompassPoint8: getCompassPoint8,
      getCompassPoint16: getCompassPoint16,
      compassToString: compassToString,
      compassToStringVerbose: compassToStringVerbose,
      getZodiac: getZodiac,
      getMoonPhase: getMoonPhase,
      getBodyRadiusAU: getBodyRadiusAU,
      decodeAngleFromStorage: decodeAngleFromStorage,
      encodeAngleToStorage: encodeAngleToStorage,
      encodeAngleToMath: encodeAngleToMath,
      decodeAngleFromMath: decodeAngleFromMath,
      combineSecUsec: combineSecUsec,
      splitSecUsec: splitSecUsec
  };

  function isFunction(funcToCheck) {
      var getType = {};
      return funcToCheck && getType.toString.call(funcToCheck) === '[object Function]';
  }

  function isObject(objToCheck) {
      return objToCheck !== null && typeof objToCheck === 'object';
  }

  function toRadians(degrees) {
      return degrees * Math.PI / 180;
  }

  function toDegrees(radians) {
      return radians * 180 / Math.PI;
  }

  function calculateObliquityOfEcliptic(jd) {
      var obliquity = toRadians(23.4393 - 3.563E-7 * (jd - 2451543.5));
      return obliquity;
  }

  function calculatePrecessionSinceJ2000(jd) {
      var precession = toRadians(3.82394E-5 * (jd - 2451543.5));
      return precession;
  }

  function formatHMS(radians) {
      var str, temp, hours, hour, minute, second, remainder;
      hours = radians * 12 / Math.PI;
      if (hours < 0) {
          hours += 24;
      }
      hours += 0.001 / 60 / 60;
      if (hours >= 24) {
          hours -= 24;
      }
      remainder = hours;
      hour = Math.floor(remainder);
      remainder = (remainder - hour) * 60;
      minute = Math.floor(remainder);
      remainder = (remainder - minute) * 60;
      second = remainder;

      temp = '0' + hour.toFixed(0);
      str = temp.substr(temp.length - 2, 2);
      str += ':';
      temp = '0' + minute.toFixed(0);
      str += temp.substr(temp.length - 2, 2);
      str += ':';
      temp = '0' + second.toFixed(2);
      str += temp.substr(temp.length - 5, 5);
      return str;
  }

  function formatDMS(radians) {
      var str, temp, degrees, degree, minute, second, remainder, sign;
      degrees = toDegrees(radians);
      if (degrees < 0) {
          sign = '-';
          degrees = -degrees;
      }
      else {
          sign = '+';
      }
      degrees += 0.001 / 60 / 60;
      remainder = degrees;
      degree = Math.floor(remainder);
      remainder = (remainder - degree) * 60;
      minute = Math.floor(remainder);
      remainder = (remainder - minute) * 60;
      second = remainder;

      str = sign;
      temp = '0' + degree.toFixed(0);
      str += temp.substr(temp.length - 2, 2);
      str += ':';
      temp = '0' + minute.toFixed(0);
      str += temp.substr(temp.length - 2, 2);
      str += ':';
      temp = '0' + second.toFixed(2);
      str += temp.substr(temp.length - 5, 5);
      return str;
  }

  function parseHMS (strHMS) {
      var parts = strHMS.split(':');
      if (parts.length !== 3) {
          console.log('Argument not formatted properly \'' +
              strHMS + '\'. Expected \'hh:mm:ss.ss\'');
          return 0;
      }
      var hours = parseFloat(parts[0]);
      var minutes = parseFloat(parts[1]);
      var seconds = parseFloat(parts[2]);
      hours += (minutes + seconds / 60) / 60;
      var radians = hours * Math.PI / 12;
      return radians;
  }

  function parseDMS (strDMS) {
      var parts = strDMS.split(':');
      if (parts.length !== 3) {
          console.log('Argument not formatted properly \'' +
              strDMS + '\'. Expected \'[+|-]dd:mm:ss.ss\'');
          return 0;
      }
      var degrees = parseFloat(parts[0]);
      var minutes = parseFloat(parts[1]);
      var seconds = parseFloat(parts[2]);
      var multiplier = 1;
      if (parts[0].charAt(0) === '-') {
          degrees = Math.abs(degrees);
          multiplier = -1;
      }
      degrees = multiplier * (degrees + ((minutes + seconds / 60) / 60));
      var radians = degrees * Math.PI / 180;
      return radians;
  }

  function getCompassPoint8(azimuthDeg) {
      // Input: -180.0 <= azimuthDeg <= 180.0. South is 0.0.
      var compassIndex = Math.trunc((azimuthDeg + 202.5) / 45.0);
      compassIndex *= 2;
      if (compassIndex > 15) {
          compassIndex = 0;
      }
      return compassIndex;
  }

  function getCompassPoint16(azimuthDeg) {
      // Input: -180.0 <= azimuthDeg <= 180.0. South is 0.0.
      var compassIndex = Math.trunc((azimuthDeg + 191.25) / 22.5);
      if (compassIndex > 15) {
          compassIndex = 0;
      }
      return compassIndex;
  }

  function compassToString(compassIndex) {
      if (compassIndex >= 0 && compassIndex <= 15) {
          return compassPoints[compassIndex];
      }
      return '???';
  }

  function compassToStringVerbose(compassIndex) {
      if (compassIndex >= 0 && compassIndex <= 15) {
          return compassPointsVerbose[compassIndex];
      }
      return '???';
  }

  function getZodiac(eclipticLongitudeDeg) {
      var longitude = eclipticLongitudeDeg;
      if (longitude < 0) {
          longitude += 360;
      }
      for (var i = 0; i < zodiac.length; i++) {
          if (longitude >= zodiac[i].longitude) {
              return [zodiac[i].constellation, zodiac[i].constellationVerbose];
          }
      }
      return ['???', '???'];
  }

  function getMoonPhase(phasePct) {
      for (var i = 0, n = moonPhase.length; i < n; i++) {
          if (phasePct >= moonPhase[i].phasePct) {
              return moonPhase[i].phaseStr;
          }
      }
      return moonPhase[0].phaseStr;
  }

  function getBodyRadiusAU(bodyName) {
      return bodyRadiusKm[bodyName] / 149597870.691;
  }

  function encodeAngleToStorage(dec) {
      // Packs an angle into a Javascript Number object.
      // This is a loss-less implementation using powers of 2.
      //  dec is an array of five integers:
      //  dec[0] is sign: -1 or 1
      //  dec[1] is degrees: 0 to 360
      //  dec[2] is minutes: 0 to 59
      //  dec[3] is seconds: 0 to 59
      //  dec[4] is microseconds: 0 to 999999
      // Example:
      //  Input: [-1, 73, 50, 17, 600000]
      //  Output: -316906481600 (wrong, must update)
      //  which represents the longitude of home at 73 deg 50 min 17.6 sec West
      var sign = dec[0] > 0 ? 1 : 0;
      var enc = (dec[4] + (dec[3] + (dec[2] + dec[1] * 64) * 64) * 1048576) * 2 + sign;
      return enc;
  }

  function decodeAngleFromStorage(enc) {
      // Unpacks an angle (see function 'encodeAngleToStorage')
      // Example:
      //  Input: -316906481600 (wrong, must update)
      //  Output: [-1, 73, 50, 17, 600000]
      //  which represents the longitude of home at 73 deg 50 min 17.6 sec West
      var sign = enc % 2;
      enc = (enc - sign) / 2;
      var usec = enc % 1048576;
      enc = (enc - usec) / 1048576;
      var sec = enc % 64;
      enc = (enc - sec) / 64;
      var min = enc % 64;
      enc = (enc - min) / 64;
      var deg = enc;
      sign = sign > 0 ? 1 : -1;
      return [sign, deg, min, sec, usec];
  }

  function encodeAngleToMath(dec) {
      // Converts a decoded angle to decimal degrees.
      //  dec is an array of five integers:
      //  dec[0] is sign: -1 or 1
      //  dec[1] is degrees: 0 to 360
      //  dec[2] is minutes: 0 to 59
      //  dec[3] is seconds: 0 to 59
      //  dec[4] is microseconds: 0 to 999999
      var arcusec = ((dec[4] + (dec[3] + (dec[2] + dec[1] * 60) * 60) * 1000000) * dec[0]);
      return arcusec / (60 * 60 * 1000000);
  }

  function decodeAngleFromMath(enc) {
      // Unpacks an angle (see function 'encodeAngleToMath')
      var sign = 1;
      if (enc < 0) {
          sign = -1;
          enc = -enc;
      }
      enc = Math.trunc(enc * (60 * 60 * 1000000));
      var usec = enc % 1000000;
      enc = (enc - usec) / 1000000;
      var sec = enc % 60;
      enc = (enc - sec) / 60;
      var min = enc % 60;
      enc = (enc - min) / 60;
      var deg = enc;
      return [sign, deg, min, sec, usec];
  }

  function combineSecUsec(sec, usec) {
      // Desired:
      // (59, 0) => '59'
      // (59, 1) => '59.000001'
      // (59, 600000) => '59.6'
      // (59, 999999) => '59.999999'

      var a = '00000' + usec.toFixed(0);
      // 0 => '000000'
      // 1 => '000001'
      // 600000 => '00000600000'
      // 999999 => '00000999999'

      var b = a.slice(a.length - 6);
      // '000000' => '000000'
      // '000001' => '000001'
      // '0000600000' => '600000'
      // '00000999999' => '999999'

      var n = b.length;
      while (--n >= 0) {
          if (b.slice(n, n + 1) !== '0') {
              break;
          }
      }
      // '000000' => -1
      // '000001' => 5
      // '600000' => 0
      // '999999' => 5

      var str = sec.toFixed(0);
      if (n >= 0) {
          str = str + '.' + b.slice(0, n + 1);
      }
      // (59, 0) => '59'
      // (59, 1) => '59.000001'
      // (59, 600000) => '59.6'
      // (59, 999999) => '59.999999'

      return str;
  }

  function splitSecUsec(strSecUsec) {
      // Desired:
      // '59' => [59, 0]
      // '59.000001' => [59, 1]
      // '59.6' => [59, 600000]
      // '59.999999' => [59, 999999]
      // Other possible inputs:
      // '.01' => [0, 10000]
      // '.000000000000098' => [0, 0]

      var n = strSecUsec.indexOf('.');
      // '59' => -1
      // '59.000001' => 2
      // '59.6' => 2
      // '59.999999' => 2
      // '.01' => 0
      // '.000000000000098' => 0

      var strSec;
      if (n === -1) {
          strSec = strSecUsec;
      }
      if (n === 0) {
          strSec = '0';
      }
      if (n > 0) {
          strSec = strSecUsec.slice(0, n);
      }
      // '59' => -1 => '59'
      // '59.000001' => 2 => '59'
      // '59.6' => 2 => '59'
      // '59.999999' => 2 => '59'
      // '.01' => 0 => '0'
      // '.000000000000098' => 0 => '0'

      var a;
      if (n === -1) {
          a = '000000';
      }
      if (n >= 0) {
          a = strSecUsec.slice(n + 1) + '00000';
      }
      // '59' => -1 => '000000'
      // '59.000001' => 2 => '00000100000'
      // '59.6' => 2 => '600000'
      // '59.999999' => 2 => '99999900000'
      // '.01' => 0 => '0100000'
      // '.000000000000098' => 0 => '00000000000009800000'

      var strUsec = a.slice(0, 6);
      // '59' => -1 => '000000' => '000000'
      // '59.000001' => 2 => '00000100000' => '000001'
      // '59.6' => 2 => '600000' => '600000'
      // '59.999999' => 2 => '99999900000' => '999999'
      // '.01' => 0 => '0100000' => '010000'
      // '.000000000000098' => 0 => '00000000000009800000' => '000000'

      var sec = parseInt(strSec, 10);
      var usec = parseInt(strUsec, 10);

      return [sec, usec];
  }
});
