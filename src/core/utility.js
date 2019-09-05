define(function() {
  // Red light Extinction Coefficients:
  var Rxc = [
    // Natural Cubic Spline Interpolation Coefficients per Zenith Angle (ZA) interval:
    // ZA1   ZA2   x^3                     x^2                     x^1                     x^0
    [  0.0, 10.0,  5.4044905795245010e-7,  4.5462371796453206e-58, 4.5955094204754990e-5,  1.0 ],
    [ 10.0, 20.0,  2.9775471023774956e-7,  7.2808304314410150e-6, -2.6853210109655157e-5,  1.0002426943477147 ],
    [ 20.0, 30.0, -7.3146789890344840e-7,  6.9034186979912890e-5, -1.2619203410790928e-3,  1.0084764752208444 ],
    [ 30.0, 35.0,  3.1528827572246840e-6, -2.8055737207161903e-4,  9.2258264304668650e-3,  9.035990075053847e-1 ],
    [ 35.0, 40.0, -1.0452442175644348e-6,  1.6024596028123845e-4, -6.2022902018831465e-3,  1.083593701549468 ],
    [ 40.0, 45.0,  1.0280941130330547e-6, -8.8554639390460290e-5,  3.7497337849848027e-3,  9.509000483912289e-1 ],
    [ 45.0, 50.0,  4.9328677654322160e-6, -6.1569908246434700e-4,  2.7471233723309710e-2,  5.950775493163553e-1 ],
    [ 50.0, 55.0, -4.7595651747619180e-6,  8.3816585856477310e-4, -4.5222013328146300e-2,  1.8066316668406222 ],
    [ 55.0, 60.0,  1.4105392933615458e-5, -2.2745522293174940e-3,  1.2597748150537838e-1, -1.3320257384406637 ],
    [ 60.0, 65.0, -3.6620065596999110e-6,  9.2357967947927240e-4, -6.5910433022427590e-2,  2.5057325521154556 ],
    [ 65.0, 70.0,  6.4542633305184200e-5, -1.2376325094173126e-2,  7.9858337726497830e-1, -1.622496667077834e1 ],
    [ 70.0, 75.0, -7.8508526661036830e-5,  1.7664418498733290e-2, -1.3042686742384708,     3.284158119763547e1 ]
  ];
  // Green light Extinction Coefficients:
  var Gxc = [
    // Natural Cubic Spline Interpolation Coefficients per Zenith Angle (ZA) interval:
    // ZA1   ZA2   x^3                     x^2                     x^1                     x^0
    [  0.0, 10.0,  1.2445591495795023e-6,  1.1690206294655140e-57, 7.5544085042049760e-5,  1.0  ],
    [ 10.0, 20.0, -2.2279574789751180e-7,  4.4020646924310420e-5, -3.6466238420105446e-4,  1.001467354897477  ],
    [ 20.0, 30.0,  6.4662384201054490e-7, -8.1445284701729740e-6,  6.7864112368861350e-4,  9.945119981782126e-1  ],
    [ 30.0, 35.0,  5.5552498157654200e-7,  5.4368968887286390e-8,  4.3267420051680566e-4,  9.969716674099306e-1  ],
    [ 35.0, 40.0,  1.2017281678068652e-6, -6.7796965585296660e-5,  2.8074709099132436e-3,  9.692657058003056e-1 ],
    [ 40.0, 45.0,  2.6375623471959970e-6, -2.4009706711199250e-4,  9.6994749709810760e-3,  8.773723183194011e-1 ],
    [ 45.0, 50.0,  4.2480224434091470e-6, -4.5750918010076760e-4,  1.9483020055475957e-2,  7.306191420519779e-1  ],
    [ 50.0, 55.0,  4.3703478791674180e-6, -4.7585799546450834e-4,  2.0400460823662994e-2,  7.15328462582194e-1 ],
    [ 55.0, 60.0,  1.8270586039921184e-5, -2.7693972919888795e-3,  1.4654512213250340e-1, -1.5973236614132136  ],
    [ 60.0, 65.0, -5.4526920388521480e-6,  1.5007927621903200e-3, -1.0966628111824855e-1,  3.5269044036018258  ],
    [ 65.0, 70.0,  1.7154018211548740e-4, -3.3012817697905890e-2,  2.1337183987880053,    -4.5079763661033674e1 ],
    [ 70.0, 75.0, -2.0070803642309750e-4,  4.5159308195196930e-2, -3.3383304137291927,     8.260137529770094e1 ]
  ];
  // Blue light Extinction Coefficients:
  var Bxc = [
    // Natural Cubic Spline Interpolation Coefficients per Zenith Angle (ZA) interval:
    // ZA1   ZA2   x^3                     x^2                      x^1                     x^0
    [  0.0, 10.0,  1.5944732788694797e-6,  2.00651823727832540e-57, 1.4055267211305204e-4,  1.0 ],
    [ 10.0, 20.0,  2.7633605652601580e-8,  4.70051901965063460e-5, -3.2949922985201140e-4,  1.001566839673217 ],
    [ 20.0, 30.0,  2.9499229852011400e-7,  3.09636686244556000e-5, -8.6687984109965120e-6,  9.994279701302767e-1  ],
    [ 30.0, 35.0,  2.6721838993209414e-6, -1.82983575447618807e-4,  6.4097485237512375e-3,  9.352437969086544e-1  ],
    [ 35.0, 40.0,  3.6338903068889500e-6, -2.83962748242259800e-4,  9.9440195715636700e-3,  8.940106346841761e-1 ],
    [ 40.0, 45.0, -1.2077451268767415e-6,  2.97033503809623240e-4, -1.3295830510511650e-2,  1.2038753024451803 ],
    [ 45.0, 50.0,  9.1970902006180170e-6, -1.10761926540216900e-3,  4.9913544104019000e-2,  2.5573468322722054e-1  ],
    [ 50.0, 55.0,  4.4193843244046775e-6, -3.90963383970168250e-4,  1.4080750032418961e-2,  8.529479177538879e-1 ],
    [ 55.0, 60.0,  3.7125372501763275e-5, -5.78745143323433700e-3,  3.1088759274194820e-1, -4.588510865254149 ],
    [ 60.0, 65.0, -1.6920874331457777e-5,  3.94087299674545240e-3, -2.7281187305683910e-1,  7.085478450721599 ],
    [ 65.0, 70.0,  3.0255812482406783e-4, -5.83575318385820400e-2,  3.776584441239448,     -8.065144169236463e1 ],
    [ 70.0, 75.0, -3.4531162496481357e-4,  7.76951156170830500e-2, -5.747100880657109,      1.415678824852217e2 ]
  ];

  var calculateExtinction = function(zenithAngle, filterNormal) {
    // Algorithm:
    // 1. Given argument zenithAngle (ZA) lookup interval (V) such that ZA1 <= ZA < ZA2
    // 2. Calculate ZA*(ZA*(ZA*V[2]+V[3])+V[4])+V[5]
    var cubicSpline = [];
    if (filterNormal === "R") {
      cubicSpline = Rxc;
    }
    else if (filterNormal === "G") {
      cubicSpline = Gxc;
    }
    else if (filterNormal === "B") {
      cubicSpline = Bxc;
    }
    var extinction = Number.NaN;
    if (cubicSpline.length > 0) {
      var length = cubicSpline.length;
      for (var index = 0; index < length; index++) {
        var interval = cubicSpline[index];
        if (interval[0] <= zenithAngle && zenithAngle < interval[1]) {
          extinction = zenithAngle*(zenithAngle*(zenithAngle*interval[2]+interval[3])+interval[4])+interval[5];
          break;
        }
      }
    }
    return extinction;
  }

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
      splitSecUsec: splitSecUsec,
      calculateExtinction: calculateExtinction
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
