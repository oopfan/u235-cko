define(['knockout', 'clipboard', 'vector3d', 'matrix3d', 'timekeeper', 'text!./lrgb-stack-balancer.html'], function(ko, ClipboardJS, Vector3D, Matrix3D, Timekeeper, templateMarkup) {

  function LrgbStackBalancer(params) {
    $("#fileopen").val("");

    var clipboard;
    $("#modal-export").on("shown.bs.modal", function() {
      var originalMessage = "Copy to clipboard";
      $('#content-export-button').tooltip({
        trigger: 'click hover',
        placement: 'bottom',
        title: originalMessage
      });
      function setTooltip(btn, message) {
        $(btn).tooltip('hide')
          .attr('data-original-title', message)
          .tooltip('show');
      }
      function hideTooltip(btn, message) {
        setTimeout(function() {
          $(btn).tooltip('hide')
            .attr('data-original-title', message);
        }, 1000);
      }
      clipboard = new ClipboardJS('#content-export-button', {
        container: document.getElementById('modal-export')
      });
      clipboard.on('success', function(e) {
        setTooltip(e.trigger, 'Copied!');
        hideTooltip(e.trigger, originalMessage);
        e.clearSelection();
      });
      clipboard.on('error', function(e) {
        setTooltip(e.trigger, 'Failed!');
        hideTooltip(e.trigger, originalMessage);
      });
    });
    $("#modal-export").on("hidden.bs.modal", function() {
      clipboard.destroy();
    });

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
    function calculateExtinction(zenithAngle, cubicSpline) {
      // Algorithm:
      // 1. Given argument zenithAngle (ZA) lookup interval (V) such that ZA1 <= ZA < ZA2
      // 2. Calculate ZA*(ZA*(ZA*V[2]+V[3])+V[4])+V[5]
      var extinction;
      var length = cubicSpline.length;
      for (var index = 0; index < length; index++) {
        var interval = cubicSpline[index];
        if (interval[0] <= zenithAngle && zenithAngle < interval[1]) {
          extinction = zenithAngle*(zenithAngle*(zenithAngle*interval[2]+interval[3])+interval[4])+interval[5];
          break;
        }
      }
      return extinction;
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
    function calculateGeoEquToGeoHor(gmst, latitude, longitude) {
        var lmst = gmst + longitude / 15;
        var rotY = new Matrix3D();
        rotY.setRotateY(toRadians(90 - latitude));
        var rotZ = new Matrix3D();
        rotZ.setRotateZ(toRadians(lmst * 15));
        var mat = new Matrix3D();
        mat.matrixMultiply(rotY).matrixMultiply(rotZ);
        return mat;
    }
    function calculateAltitude(raJ2000, deJ2000, universalTime, latitude, longitude) {
      // raJ2000 assumed to be in radians.
      // deJ2000 assumed to be in radians.
      // latitude and longitude are in degrees.
      // universalTime is a built-in Javascript object.
      // returns altitude in degrees.
      var t = new Timekeeper();
      t.setDate(universalTime);
      var julianDate = t.getJD();
      var gmst = t.getGMST();

      var obliquity = calculateObliquityOfEcliptic(julianDate);
      var precession = calculatePrecessionSinceJ2000(julianDate);

      var matEquToEcl = new Matrix3D();
      matEquToEcl.setRotateX(obliquity);

      var matEclToEqu = new Matrix3D();
      matEclToEqu.setRotateX(-obliquity);

      var matPrecessToDate = new Matrix3D();
      matPrecessToDate.setRotateZ(-precession);

      var matGeoEquToGeoHor = calculateGeoEquToGeoHor(gmst, latitude, longitude);

      // Geocentric Equatorial J2000:
      var vec = new Vector3D();
      vec.setPolar(raJ2000, deJ2000, 1);

      // Geocentric Ecliptic J2000:
      vec.matrixMultiply(matEquToEcl);

      // Geocentric Ecliptic Of Date:
      vec.matrixMultiply(matPrecessToDate);

      // Geocentric Equatorial Of Date:
      vec.matrixMultiply(matEclToEqu);

      // Geocentric Horizontal Of Date:
      vec.matrixMultiply(matGeoEquToGeoHor);

      var result = vec.getPolar();
      var altitude = toDegrees(result[1]);
      return altitude;
    }
    var StagedFile = function() {
      this.selected = ko.observable(false);
      this.filename = ko.observable("");
      this.siteLat = ko.observable("");
      this.siteLong = ko.observable("");
      this.dateObs = ko.observable("");
      this.objectName = ko.observable("");
      this.RA = ko.observable("");
      this.DEC = ko.observable("");
      this.objectRA = ko.observable("");
      this.objectDEC = ko.observable("");
      this.expTime = ko.observable("");
      this.filter = ko.observable("");
      this.instrument = ko.observable("");
      this.altitude = ko.computed(function() {
        var raParts = this.objectRA().split(' ');
        if (raParts.length !== 3) {
          return Number.NaN;
        }
        var raHours = Number.parseFloat(raParts[0]) + (Number.parseFloat(raParts[1]) + Number.parseFloat(raParts[2]) / 60) / 60;
        var raJ2000 = toRadians(raHours * 15);

        var deParts = this.objectDEC().split(' ');
        if (deParts.length !== 3) {
          return Number.NaN;
        }
        var deDegrees = Number.parseFloat(deParts[0]);
        var deIsNegative = deDegrees < 0;
        deDegrees = Math.abs(deDegrees) + (Number.parseFloat(deParts[1]) + Number.parseFloat(deParts[2]) / 60) / 60;
        if (deIsNegative) {
          deDegrees = -deDegrees;
        }
        var deJ2000 = toRadians(deDegrees);

        var dateObs = new Date(this.dateObs());
        var universalTime = new Date(
          Date.UTC(dateObs.getFullYear(), dateObs.getMonth(), dateObs.getDate(), dateObs.getHours(), dateObs.getMinutes(), dateObs.getSeconds())
          );
        var latitude = this.siteLat();
        var longitude = this.siteLong();

        var altitude = calculateAltitude(raJ2000, deJ2000, universalTime, latitude, longitude);
        return altitude;
      }, this);
      this.zenithAngle = ko.computed(function() {
        return 90 - this.altitude();
      }, this);
      this.altitudeFmt = ko.computed(function() {
        return Number(this.altitude()).toFixed(3);
      }, this);
      this.airmass = ko.computed(function() {
        var zenithDistance = 90 - this.altitude();
        var airmass = 1 / Math.cos(toRadians(zenithDistance));
        return airmass;
      }, this);
      this.airmassFmt = ko.computed(function() {
        return Number(this.airmass()).toFixed(3);
      }, this);
      this.extinction = ko.computed(function() {
        var zenithAngle = this.zenithAngle();
        var filter = this.filter().trim().toUpperCase();
        var extinction = Number.NaN;
        if (filter === "R" || filter === "RED" || filter === "OPR") {
          extinction = calculateExtinction(zenithAngle, Rxc);
        }
        else if (filter === "G" || filter === "GREEN" || filter === "OPG") {
          extinction = calculateExtinction(zenithAngle, Gxc);
        }
        else if (filter === "B" || filter === "BLUE" || filter === "OPB") {
          extinction = calculateExtinction(zenithAngle, Bxc);
        }
        else if (filter === "L" || filter === "LUM" || filter === "OPL") {
          extinction = (
            calculateExtinction(zenithAngle, Rxc) +
            calculateExtinction(zenithAngle, Gxc) +
            calculateExtinction(zenithAngle, Bxc)
          ) / 3;
        }
        return extinction;
      }, this);
      this.extinctionFmt = ko.computed(function() {
        return Number(this.extinction()).toFixed(3);
      }, this);
      this.extinctionAdjustedExpTime = ko.computed(function() {
        return this.expTime() / this.extinction();
      }, this);
    }

    var self = this;
    self.luminanceAdjustedTotalIntegrationTime = ko.observable(30);
    self.luminanceViolation = ko.observable(true);
    self.colorAdjustedTotalIntegrationTime = ko.observable(90);
    self.redRatio = ko.observable(1.62);
    self.redViolation = ko.observable(true);
    self.greenRatio = ko.observable(1.0);
    self.greenViolation = ko.observable(true);
    self.blueRatio = ko.observable(1.34);
    self.blueViolation = ko.observable(true);
    self.stagedFiles = ko.observableArray();
    self.readFiles = function (data, event) {
      var fileList = event.target.files;
      for(var i=0; i < fileList.length; i++ ) {
        readAsFITS(fileList[i]);
      }
    };
    self.colorViolation = ko.computed(function() {
      return self.redViolation() || self.greenViolation() || self.blueViolation();
    });
    self.luminanceAdjustedTotalIntegrationTime.subscribe(function(newValue) {
      foo();
    });
    self.colorAdjustedTotalIntegrationTime.subscribe(function(newValue) {
      foo();
    });
    self.redRatio.subscribe(function(newValue) {
      foo();
    });
    self.greenRatio.subscribe(function(newValue) {
      foo();
    });
    self.blueRatio.subscribe(function(newValue) {
      foo();
    });
    function foo() {
      var factor = 1 * self.redRatio() + 1 * self.greenRatio() + 1 * self.blueRatio();
      var totalRedTime = self.colorAdjustedTotalIntegrationTime() * self.redRatio() / factor;
      var totalGreenTime = self.colorAdjustedTotalIntegrationTime() * self.greenRatio() / factor;
      var totalBlueTime = self.colorAdjustedTotalIntegrationTime() * self.blueRatio() / factor;
      var totalLumTime = self.luminanceAdjustedTotalIntegrationTime();
      var sumRedTime = 0;
      var sumGreenTime = 0;
      var sumBlueTime = 0;
      var sumLumTime = 0;

      for (var i = 0; i < self.stagedFiles().length; i++) {
        var expTime = self.stagedFiles()[i].extinctionAdjustedExpTime() / 60.0;
        var filter = self.stagedFiles()[i].filter().trim().toUpperCase();
        if (filter === "L" || filter === "LUM" || filter === "OPL") {
          self.stagedFiles()[i].selected(sumLumTime < totalLumTime)
          sumLumTime += expTime;
        }
        else if (filter === "R" || filter === "RED" || filter === "OPR") {
          self.stagedFiles()[i].selected(sumRedTime < totalRedTime)
          sumRedTime += expTime;
        }
        else if (filter === "G" || filter === "GREEN" || filter === "OPG") {
          self.stagedFiles()[i].selected(sumGreenTime < totalGreenTime)
          sumGreenTime += expTime;
        }
        else if (filter === "B" || filter === "BLUE" || filter === "OPB") {
          self.stagedFiles()[i].selected(sumBlueTime < totalBlueTime)
          sumBlueTime += expTime;
        }
      }

      self.luminanceViolation(sumLumTime < totalLumTime);
      self.redViolation(sumRedTime < totalRedTime);
      self.greenViolation(sumGreenTime < totalGreenTime);
      self.blueViolation(sumBlueTime < totalBlueTime);

      $("#fileopen").val("");
    }
    self.exportIt = function() {
      $("#content-export").val("Working...");
      $("#modal-export").modal();
      setTimeout(function() {
        var sortedFiles = self.stagedFiles.sorted(function(left, right) {
          var result;
          if (left.filter() === right.filter()) {
            if (left.filename() === right.filename()) {
              result = 0;
            }
            else if (left.filename() > right.filename()) {
              result = 1;
            }
            else {
              result = -1;
            }
          }
          else if (left.filter() > right.filter()) {
            result = 1;
          }
          else {
            result = -1;
          }
          return result;
        });
        var content = "filter,file,include\n";
        for (var i = 0; i < sortedFiles.length; i++) {
          var filter = sortedFiles[i].filter();
          var filename = sortedFiles[i].filename();
          var selected = sortedFiles[i].selected() ? "x" : "";
          content += filter + "," + filename + "," + selected + "\n";
        }
        $("#content-export").val(content);
      }, 1000);
    }
    function readAsFITS(theFile) {
      var f = new astro.FITS(theFile, function() {
        var header = this.getHeader();
        var stagedFile = new StagedFile();
        stagedFile.filename(this.arg.name);
        stagedFile.siteLat(header.get('SITELAT'));
        stagedFile.siteLong(header.get('SITELONG'));
        stagedFile.dateObs(header.get('DATE-OBS'));
        stagedFile.objectName(header.get('OBJECT'));
        stagedFile.objectRA(header.get('OBJCTRA'));
        stagedFile.objectDEC(header.get('OBJCTDEC'));
        stagedFile.expTime(header.get('EXPTIME'));
        stagedFile.filter(header.get('FILTER'));
        stagedFile.instrument(header.get('INSTRUME'));
        self.stagedFiles.push(stagedFile);
        self.stagedFiles.sort(function(left, right) {
          return left.extinction() - right.extinction();
        });
        foo();
      });
    }
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  LrgbStackBalancer.prototype.dispose = function() { };

  return { viewModel: LrgbStackBalancer, template: templateMarkup };

});
