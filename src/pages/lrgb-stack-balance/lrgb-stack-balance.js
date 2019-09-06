define(['knockout', "ko-modal-helper", 'vector3d', 'matrix3d', 'timekeeper', 'utility', 'text!./lrgb-stack-balance.html'],
  function(ko, modalHelper, Vector3D, Matrix3D, Timekeeper, utility, templateMarkup) {

  function LrgbStackBalance(params) {
    $("#fileopen").val("");

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
      updateAll();
    });

    self.colorAdjustedTotalIntegrationTime.subscribe(function(newValue) {
      updateAll();
    });

    self.redRatio.subscribe(function(newValue) {
      updateAll();
    });

    self.greenRatio.subscribe(function(newValue) {
      updateAll();
    });

    self.blueRatio.subscribe(function(newValue) {
      updateAll();
    });

    self.exportIt = function() {
      modalHelper.showModal({
        viewModel: new ExportViewModel(self.stagedFiles),
        context: this // Set context so we don't need to bind the callback function
      })
      .done(function(result) {
        //console.log("Modal closed with result: ", result);
      })
      .fail(function() {
        //console.log("Modal cancelled");
      });
    };

    function updateAll() {
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
        updateAll();
      });
    }
  }

  function ExportViewModel(files) {
    var self = this;
    self.files = files;
    self.template = "modal-export";
    self.content = ko.observable("Working...");
    self.buttonClick = function() {
      var element = $('#content-export');
      element.focus();
      element.select();
      document.execCommand('copy');
      self.buttonText("Copied to clipboard!");
    };
    self.buttonText = ko.observable("Copy to clipboard");
    self.cancel = function() {
      self.modal.close();
    };
    setTimeout(function() {
      var sortedFiles = self.files.sorted(function(left, right) {
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
      self.content(content);
    }, 1000);
  }

  function StagedFile() {
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
      var raJ2000 = utility.toRadians(raHours * 15);

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
      var deJ2000 = utility.toRadians(deDegrees);

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
      var airmass = 1 / Math.cos(utility.toRadians(zenithDistance));
      return airmass;
    }, this);

    this.airmassFmt = ko.computed(function() {
      return Number(this.airmass()).toFixed(3);
    }, this);

    this.extinction = ko.computed(function() {
      var zenithAngle = this.zenithAngle();
      var filter = normalizeFilter(this.filter());
      if (filter === "L") {
        return (
          utility.calculateExtinction(zenithAngle, "R") +
          utility.calculateExtinction(zenithAngle, "G") +
          utility.calculateExtinction(zenithAngle, "B")
        ) / 3;
      }
      else {
        return utility.calculateExtinction(zenithAngle, filter);
      }
    }, this);

    this.extinctionFmt = ko.computed(function() {
      return Number(this.extinction()).toFixed(3);
    }, this);

    this.extinctionAdjustedExpTime = ko.computed(function() {
      return this.expTime() / this.extinction();
    }, this);

    function calculateGeoEquToGeoHor(gmst, latitude, longitude) {
      var lmst = gmst + longitude / 15;
      var rotY = new Matrix3D();
      rotY.setRotateY(utility.toRadians(90 - latitude));
      var rotZ = new Matrix3D();
      rotZ.setRotateZ(utility.toRadians(lmst * 15));
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

      var obliquity = utility.calculateObliquityOfEcliptic(julianDate);
      var precession = utility.calculatePrecessionSinceJ2000(julianDate);

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
      var altitude = utility.toDegrees(result[1]);
      return altitude;
    }

  }

  function normalizeFilter(filterName) {
    var filterNormal;
    var filterClean = filterName.trim().toUpperCase();
    if (filterClean === "R" || filterClean === "RED" || filterClean === "OPR") {
      filterNormal = "R";
    }
    else if (filterClean === "G" || filterClean === "GREEN" || filterClean === "OPG") {
      filterNormal = "G";
    }
    else if (filterClean === "B" || filterClean === "BLUE" || filterClean === "OPB") {
      filterNormal = "B";
    }
    else if (filterClean === "L" || filterClean === "LUM" || filterClean === "OPL") {
      filterNormal = "L";
    }
    return filterNormal;
  }

  LrgbStackBalance.prototype.dispose = function() {
    this.colorViolation.dispose();
  };

  StagedFile.prototype.dispose = function() {
    this.altitude.dispose();
    this.zenithAngle.dispose();
    this.altitudeFmt.dispose();
    this.airmass.dispose();
    this.airmassFmt.dispose();
    this.extinction.dispose();
    this.extinctionFmt.dispose();
    this.extinctionAdjustedExpTime.dispose();
  };

  return { viewModel: LrgbStackBalance, template: templateMarkup };

});
