define(['knockout', 'ko-modal-helper', 'astrocalc-v1-engine', 'astrocalc-v1-accumulator', 'astrocalc-v1-memory', 'text!./astrocalc-v1.html'],
  function (ko, modalHelper, Engine, Accumulator, Memory, templateMarkup) {

  function AstroCalcViewModel() {
    var lastObservatory = {
      name: "New York City",
      latitudeDegrees: 40,
      latitudeMinutes: 43,
      latitudeSeconds: 0,
      latitudeNorthSouth: "N",
      longitudeDegrees: 74,
      longitudeMinutes: 0,
      longitudeSeconds: 0,
      longitudeEastWest: "W",
      autostoreEnable: true,
      autostoreLocation: "Observatory"
    };

    var date = new Date();
    var lastUniversalTime = {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
      hour: date.getUTCHours(),
      minute: date.getUTCMinutes(),
      second: date.getUTCSeconds(),
      autostoreEnable: true,
      autostoreLocation: "UniversalTime"
    };

    var lastLocalTime = {
      selectedObservatory: "Observatory",
      selectedUniversalTime: "UniversalTime",
      autostoreEnable: true,
      autostoreLocation: "LocalTime"
    };

    var lastCoordinates = {
      raHours: 0,
      raMinutes: 0,
      raSeconds: 0,
      decDegrees: 0,
      decMinutes: 0,
      decSeconds: 0,
      decNorthSouth: "N",
      autostoreEnable: true,
      autostoreLocation: "Coordinates J2000"
    };

    var lastPrecession = {
      selectedCoordinates: "Coordinates J2000",
      selectedUniversalTime: "UniversalTime",
      autostoreEnable: true,
      autostoreLocation: "Coordinates Now"
    };

    var lastTransformation = {
      selectedCoordinates: "Coordinates Now",
      selectedLocalTime: "LocalTime",
      autostoreEnable: true,
      autostoreLocation: "Coordinates Alt/Az"
    };

    this.accumulatorArray = ko.observableArray();
    var accumulator = new Accumulator(this.accumulatorArray);
    this.memoryArray = ko.observableArray();
    var memory = new Memory(this.memoryArray);
    var engine = new Engine(accumulator, memory);
    this.observatoryKeys = ko.computed(function() {
      var keys = [];
      if (this.memoryArray().length > 0) {
        keys = memory.getKeysByType("Observatory");
      }
      return keys;
    }, this);
    this.universalTimeKeys = ko.computed(function() {
      var keys = [];
      if (this.memoryArray().length > 0) {
        keys = memory.getKeysByType("UniversalTime");
      }
      return keys;
    }, this);
    this.localTimeKeys = ko.computed(function() {
      var keys = [];
      if (this.memoryArray().length > 0) {
        keys = memory.getKeysByType("LocalTime");
      }
      return keys;
    }, this);
    this.coordinateKeys = ko.computed(function() {
      var keys = [];
      if (this.memoryArray().length > 0) {
        keys = memory.getKeysByType("Coordinates");
      }
      return keys;
    }, this);
    this.coordinateGeoEquJ2000Keys = ko.computed(function() {
      var keys = [];
      var length = this.coordinateKeys().length;
      for (var index = 0; index < length; index++) {
        var key = this.coordinateKeys()[index];
        var coordinates = memory.getValue(key);
        if (coordinates.origin === 'Geo' && coordinates.frame === 'Equ' && coordinates.epoch === 'J2000') {
          keys.push(key);
        }
      }
      return keys;
    }, this);
    this.coordinateGeoEquKeys = ko.computed(function() {
      var keys = [];
      var length = this.coordinateKeys().length;
      for (var index = 0; index < length; index++) {
        var key = this.coordinateKeys()[index];
        var coordinates = memory.getValue(key);
        if (coordinates.origin === 'Geo' && coordinates.frame === 'Equ') {
          keys.push(key);
        }
      }
      return keys;
    }, this);
    this.enableLocalTime = ko.computed(function() {
      return this.observatoryKeys().length > 0 && this.universalTimeKeys().length > 0;
    }, this);
    this.enablePrecession = ko.computed(function() {
      return this.coordinateGeoEquJ2000Keys().length > 0 && this.universalTimeKeys().length > 0;
    }, this);
    this.enableTransformation = ko.computed(function() {
      return this.coordinateGeoEquKeys().length > 0 && this.localTimeKeys().length > 0;
    }, this);
    this.clickObservatory = function(data, event) {
      modalHelper.showModal({
        viewModel: new ObservatoryViewModel(engine, lastObservatory),
        context: this
      });
    };
    this.clickUniversalTime = function(data, event) {
      modalHelper.showModal({
        viewModel: new UniversalTimeViewModel(engine, lastUniversalTime),
        context: this
      });
    };
    this.clickLocalTime = function(data, event) {
      modalHelper.showModal({
        viewModel: new LocalTimeViewModel(engine, lastLocalTime, this.observatoryKeys(), this.universalTimeKeys()),
        context: this
      });
    };
    this.clickCoordinates = function(data, event) {
      modalHelper.showModal({
        viewModel: new CoordinatesViewModel(engine, lastCoordinates),
        context: this
      });
    };
    this.clickPrecession = function(data, event) {
      modalHelper.showModal({
        viewModel: new PrecessionViewModel(engine, lastPrecession, this.coordinateGeoEquJ2000Keys(), this.universalTimeKeys()),
        context: this
      });
    };
    this.clickTransformation = function(data, event) {
      modalHelper.showModal({
        viewModel: new TransformationViewModel(engine, lastTransformation, this.coordinateGeoEquKeys(), this.localTimeKeys()),
        context: this
      });
    };
    this.clickStore = function(data, event) {
      modalHelper.showModal({
        viewModel: new StoreViewModel(engine, accumulator.getValue().type),
        context: this
      });
    };
    this.clickLoad = function(data, event) {
      modalHelper.showModal({
        viewModel: new LoadViewModel(engine, memory.getKeys()),
        context: this
      });
    };
    this.clickClearAll = function(data, event) {
      modalHelper.showModal({
        viewModel: new ClearAllViewModel(engine),
        context: this
      });
    };
  }

  function ObservatoryViewModel(engine, lastObservatory) {
    this.template = "modal-observatory";
    this.name = ko.observable(lastObservatory.name);
    this.latitudeDegrees = ko.observable(lastObservatory.latitudeDegrees);
    this.latitudeMinutes = ko.observable(lastObservatory.latitudeMinutes);
    this.latitudeSeconds = ko.observable(lastObservatory.latitudeSeconds);
    this.latitudeNorthSouth = ko.observable(lastObservatory.latitudeNorthSouth);
    this.longitudeDegrees = ko.observable(lastObservatory.longitudeDegrees);
    this.longitudeMinutes = ko.observable(lastObservatory.longitudeMinutes);
    this.longitudeSeconds = ko.observable(lastObservatory.longitudeSeconds);
    this.longitudeEastWest = ko.observable(lastObservatory.longitudeEastWest);
    this.autostoreEnable = ko.observable(lastObservatory.autostoreEnable);
    this.autostoreLocation = ko.observable(lastObservatory.autostoreLocation);

    this.submitForm = function() {
      lastObservatory.name = this.name();
      lastObservatory.latitudeDegrees = this.latitudeDegrees();
      lastObservatory.latitudeMinutes = this.latitudeMinutes();
      lastObservatory.latitudeSeconds = this.latitudeSeconds();
      lastObservatory.latitudeNorthSouth = this.latitudeNorthSouth();
      lastObservatory.longitudeDegrees = this.longitudeDegrees();
      lastObservatory.longitudeMinutes = this.longitudeMinutes();
      lastObservatory.longitudeSeconds = this.longitudeSeconds();
      lastObservatory.longitudeEastWest = this.longitudeEastWest();
      lastObservatory.autostoreEnable = this.autostoreEnable();
      lastObservatory.autostoreLocation = this.autostoreLocation();

      var latitude = Number.parseInt(this.latitudeDegrees()) + (Number.parseInt(this.latitudeMinutes()) + Number.parseInt(this.latitudeSeconds()) / 60) / 60;
      if (this.latitudeNorthSouth() === 'S') {
        latitude = -latitude;
      }
      var longitude = Number.parseInt(this.longitudeDegrees()) + (Number.parseInt(this.longitudeMinutes()) + Number.parseInt(this.longitudeSeconds()) / 60) / 60;
      if (this.longitudeEastWest() === 'W') {
        longitude = -longitude;
      }

      var command = "Observatory";
      var args = {};
      args.name = this.name();
      args.latitude = latitude;
      args.longitude = longitude;
      engine.submit(command, args);

      if (this.autostoreEnable()) {
        var command = "Store";
        var args = {};
        args.to = this.autostoreLocation();
        engine.submit(command, args);
      }
      this.modal.close();
    };

    this.cancelForm = function(data, event) {
      this.modal.close();
    };
  }

  function UniversalTimeViewModel(engine, lastUniversalTime) {
    this.template = "modal-universal-time";
    this.year = ko.observable(lastUniversalTime.year);
    this.month = ko.observable(lastUniversalTime.month);
    this.day = ko.observable(lastUniversalTime.day);
    this.hour = ko.observable(lastUniversalTime.hour);
    this.minute = ko.observable(lastUniversalTime.minute);
    this.second = ko.observable(lastUniversalTime.second);
    this.autostoreEnable = ko.observable(lastUniversalTime.autostoreEnable);
    this.autostoreLocation = ko.observable(lastUniversalTime.autostoreLocation);

    this.clickNow = function(data, event) {
      var date = new Date();
      this.year(date.getUTCFullYear());
      this.month(date.getUTCMonth() + 1);
      this.day(date.getUTCDate());
      this.hour(date.getUTCHours());
      this.minute(date.getUTCMinutes());
      this.second(date.getUTCSeconds());
    };

    this.submitForm = function() {
      lastUniversalTime.year = this.year();
      lastUniversalTime.month = this.month();
      lastUniversalTime.day = this.day();
      lastUniversalTime.hour = this.hour();
      lastUniversalTime.minute = this.minute();
      lastUniversalTime.second = this.second();
      lastUniversalTime.autostoreEnable = this.autostoreEnable();
      lastUniversalTime.autostoreLocation = this.autostoreLocation();

      var date = new Date(Date.UTC(this.year(), this.month()-1, this.day(), this.hour(), this.minute(), this.second()));

      var year = date.getUTCFullYear().toFixed(0);
      var month = '0' + (date.getUTCMonth() + 1).toFixed(0);
      month = month.substr(month.length - 2, 2);
      var day = '0' + date.getUTCDate().toFixed(0);
      day = day.substr(day.length - 2, 2);

      var hour = '0' + date.getUTCHours().toFixed(0);
      hour = hour.substr(hour.length - 2, 2);
      var minute = '0' + date.getUTCMinutes().toFixed(0);
      minute = minute.substr(minute.length - 2, 2);
      var second = '0' + date.getUTCSeconds().toFixed(0);
      second = second.substr(second.length - 2, 2);

      var command = "UniversalTime";
      var args = {};
      args.date = year + '-' + month + '-' + day;
      args.time = hour + ':' + minute + ':' + second;
      engine.submit(command, args);

      if (this.autostoreEnable()) {
        var command = "Store";
        var args = {};
        args.to = this.autostoreLocation();
        engine.submit(command, args);
      }
      this.modal.close();
    };

    this.cancelForm = function(data, event) {
      this.modal.close();
    };
  }

  function LocalTimeViewModel(engine, lastLocalTime, observatoryKeys, universalTimeKeys) {
    this.template = "modal-local-time";
    this.availableObservatories = observatoryKeys;
    this.selectedObservatory = ko.observable(lastLocalTime.selectedObservatory);
    this.availableUniversalTimes = universalTimeKeys;
    this.selectedUniversalTime = ko.observable(lastLocalTime.selectedUniversalTime);
    this.autostoreEnable = ko.observable(lastLocalTime.autostoreEnable);
    this.autostoreLocation = ko.observable(lastLocalTime.autostoreLocation);

    this.submitForm = function() {
      lastLocalTime.selectedObservatory = this.selectedObservatory();
      lastLocalTime.selectedUniversalTime = this.selectedUniversalTime();
      lastLocalTime.autostoreEnable = this.autostoreEnable();
      lastLocalTime.autostoreLocation = this.autostoreLocation();

      var command = "LocalTime";
      var args = {};
      args.observatory = this.selectedObservatory();
      args.universalTime = this.selectedUniversalTime();
      engine.submit(command, args);

      if (this.autostoreEnable()) {
        var command = "Store";
        var args = {};
        args.to = this.autostoreLocation();
        engine.submit(command, args);
      }
      this.modal.close();
    };

    this.cancelForm = function(data, event) {
      this.modal.close();
    };
  }

  function CoordinatesViewModel(engine, lastCoordinates) {
    this.template = "modal-coordinates";
    this.raHours = ko.observable(lastCoordinates.raHours);
    this.raMinutes = ko.observable(lastCoordinates.raMinutes);
    this.raSeconds = ko.observable(lastCoordinates.raSeconds);
    this.decDegrees = ko.observable(lastCoordinates.decDegrees);
    this.decMinutes = ko.observable(lastCoordinates.decMinutes);
    this.decSeconds = ko.observable(lastCoordinates.decSeconds);
    this.decNorthSouth = ko.observable(lastCoordinates.decNorthSouth);
    this.autostoreEnable = ko.observable(lastCoordinates.autostoreEnable);
    this.autostoreLocation = ko.observable(lastCoordinates.autostoreLocation);

    this.submitForm = function() {
      lastCoordinates.raHours = this.raHours();
      lastCoordinates.raMinutes = this.raMinutes();
      lastCoordinates.raSeconds = this.raSeconds();
      lastCoordinates.decDegrees = this.decDegrees();
      lastCoordinates.decMinutes = this.decMinutes();
      lastCoordinates.decSeconds = this.decSeconds();
      lastCoordinates.decNorthSouth = this.decNorthSouth();
      lastCoordinates.autostoreEnable = this.autostoreEnable();
      lastCoordinates.autostoreLocation = this.autostoreLocation();

      var raHours = '0' + Number.parseInt(this.raHours()).toFixed(0);
      raHours = raHours.substr(raHours.length - 2, 2);
      var raMinutes = '0' + Number.parseInt(this.raMinutes()).toFixed(0);
      raMinutes = raMinutes.substr(raMinutes.length - 2, 2);
      var raSeconds = '0' + Number.parseInt(this.raSeconds()).toFixed(0);
      raSeconds = raSeconds.substr(raSeconds.length - 2, 2);

      var decSign = this.decNorthSouth() === 'N' ? '+' : '-';
      var decDegrees = '0' + Number.parseInt(this.decDegrees()).toFixed(0);
      decDegrees = decDegrees.substr(decDegrees.length - 2, 2);
      var decMinutes = '0' + Number.parseInt(this.decMinutes()).toFixed(0);
      decMinutes = decMinutes.substr(decMinutes.length - 2, 2);
      var decSeconds = '0' + Number.parseInt(this.decSeconds()).toFixed(0);
      decSeconds = decSeconds.substr(decSeconds.length - 2, 2);

      var command = "Coordinates";
      var args = {};
      args.ra = raHours + ':' + raMinutes + ':' + raSeconds;
      args.dec = decSign + decDegrees + ':' + decMinutes + ':' + decSeconds;
      engine.submit(command, args);

      if (this.autostoreEnable()) {
        var command = "Store";
        var args = {};
        args.to = this.autostoreLocation();
        engine.submit(command, args);
      }
      this.modal.close();
    };

    this.cancelForm = function(data, event) {
      this.modal.close();
    };
  }

  function PrecessionViewModel(engine, lastPrecession, coordinateKeys, universalTimeKeys) {
    this.template = "modal-precession";
    this.availableCoordinates = coordinateKeys;
    this.selectedCoordinates = ko.observable(lastPrecession.selectedCoordinates);
    this.availableUniversalTimes = universalTimeKeys;
    this.selectedUniversalTime = ko.observable(lastPrecession.selectedUniversalTime);
    this.autostoreEnable = ko.observable(lastPrecession.autostoreEnable);
    this.autostoreLocation = ko.observable(lastPrecession.autostoreLocation);

    this.submitForm = function() {
      lastPrecession.selectedCoordinates = this.selectedCoordinates();
      lastPrecession.selectedUniversalTime = this.selectedUniversalTime();
      lastPrecession.autostoreEnable = this.autostoreEnable();
      lastPrecession.autostoreLocation = this.autostoreLocation();

      var command = "Precession";
      var args = {};
      args.coordinates = this.selectedCoordinates();
      args.universalTime = this.selectedUniversalTime();
      engine.submit(command, args);

      if (this.autostoreEnable()) {
        var command = "Store";
        var args = {};
        args.to = this.autostoreLocation();
        engine.submit(command, args);
      }
      this.modal.close();
    };

    this.cancelForm = function(data, event) {
      this.modal.close();
    };
  }

  function TransformationViewModel(engine, lastTransformation, coordinateKeys, localTimeKeys) {
    this.template = "modal-transformation";
    this.availableCoordinates = coordinateKeys;
    this.selectedCoordinates = ko.observable(lastTransformation.selectedCoordinates);
    this.availableLocalTimes = localTimeKeys;
    this.selectedLocalTime = ko.observable(lastTransformation.selectedLocalTime);
    this.autostoreEnable = ko.observable(lastTransformation.autostoreEnable);
    this.autostoreLocation = ko.observable(lastTransformation.autostoreLocation);

    this.submitForm = function() {
      lastTransformation.selectedCoordinates = this.selectedCoordinates();
      lastTransformation.selectedLocalTime = this.selectedLocalTime();
      lastTransformation.autostoreEnable = this.autostoreEnable();
      lastTransformation.autostoreLocation = this.autostoreLocation();

      var command = "Transformation";
      var args = {};
      args.coordinates = this.selectedCoordinates();
      args.localTime = this.selectedLocalTime();
      args.to = "Hor";
      engine.submit(command, args);

      if (this.autostoreEnable()) {
        var command = "Store";
        var args = {};
        args.to = this.autostoreLocation();
        engine.submit(command, args);
      }
      this.modal.close();
    };

    this.cancelForm = function(data, event) {
      this.modal.close();
    };
  }

  function StoreViewModel(engine, defaultLocation) {
    this.template = "modal-store";
    this.location = ko.observable(defaultLocation);
    this.submitForm = function() {
      var command = "Store";
      var args = {};
      args.to = this.location();
      engine.submit(command, args);
      this.modal.close();
    };
    this.cancelForm = function(data, event) {
      this.modal.close();
    };
  }

  function LoadViewModel(engine, memoryKeys) {
    this.template = "modal-load";
    this.availableLocations = memoryKeys;
    this.selectedLocation = ko.observable(memoryKeys[0]);
    this.submitForm = function() {
      var command = "Load";
      var args = {};
      args.from = this.selectedLocation();
      engine.submit(command, args);
      this.modal.close();
    };
    this.cancelForm = function(data, event) {
      this.modal.close();
    };
  }

  function ClearAllViewModel(engine) {
    this.template = "modal-clear-all";
    this.submitForm = function() {
      var command = "ClearAll";
      var args = {};
      engine.submit(command, args);
      this.modal.close();
    };
    this.cancelForm = function(data, event) {
      this.modal.close();
    };
  }

  AstroCalcViewModel.prototype.dispose = function() {
    this.observatoryKeys.dispose();
    this.universalTimeKeys.dispose();
    this.localTimeKeys.dispose();
    this.coordinateKeys.dispose();
    this.coordinateGeoEquJ2000Keys.dispose();
    this.coordinateGeoEquKeys.dispose();
    this.enableLocalTime.dispose();
    this.enablePrecession.dispose();
    this.enableTransformation.dispose();
  };

  return { viewModel: AstroCalcViewModel, template: templateMarkup };
});
