define(['knockout', 'ko-modal-helper', 'astrocalc-v1-engine', 'astrocalc-v1-accumulator', 'astrocalc-v1-memory', 'text!./astrocalc-v1.html'],
  function (ko, modalHelper, Engine, Accumulator, Memory, templateMarkup) {

  function AstroCalcViewModel() {
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
        viewModel: new ObservatoryViewModel(engine),
        context: this
      });
    };
    this.clickUniversalTime = function(data, event) {
      modalHelper.showModal({
        viewModel: new UniversalTimeViewModel(engine),
        context: this
      });
    };
    this.clickLocalTime = function(data, event) {
      modalHelper.showModal({
        viewModel: new LocalTimeViewModel(engine, this.observatoryKeys(), this.universalTimeKeys()),
        context: this
      });
    };
    this.clickCoordinates = function(data, event) {
      modalHelper.showModal({
        viewModel: new CoordinatesViewModel(engine),
        context: this
      });
    };
    this.clickPrecession = function(data, event) {
      modalHelper.showModal({
        viewModel: new PrecessionViewModel(engine, this.coordinateGeoEquJ2000Keys(), this.universalTimeKeys()),
        context: this
      });
    };
    this.clickTransformation = function(data, event) {
      modalHelper.showModal({
        viewModel: new TransformationViewModel(engine, this.coordinateGeoEquKeys(), this.localTimeKeys()),
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

  function ObservatoryViewModel(engine) {
    this.template = "modal-observatory";
    this.name = ko.observable("New York City");
    this.latitudeDegrees = ko.observable(40);
    this.latitudeMinutes = ko.observable(43);
    this.latitudeSeconds = ko.observable(1);
    this.latitudeNorthSouth = ko.observable("N");
    this.longitudeDegrees = ko.observable(74);
    this.longitudeMinutes = ko.observable(0);
    this.longitudeSeconds = ko.observable(0);
    this.longitudeEastWest = ko.observable("W");
    this.submitForm = function() {
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
      this.modal.close();
    };
    this.cancelForm = function(data, event) {
      this.modal.close();
    };
  }

  function UniversalTimeViewModel(engine) {
    this.template = "modal-universal-time";
    var date = new Date();
    this.year = ko.observable(date.getUTCFullYear());
    this.month = ko.observable(date.getUTCMonth() + 1);
    this.day = ko.observable(date.getUTCDate());
    this.hour = ko.observable(date.getUTCHours());
    this.minute = ko.observable(date.getUTCMinutes());
    this.second = ko.observable(date.getUTCSeconds());
    this.submitForm = function() {
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

      this.modal.close();
    };
    this.cancelForm = function(data, event) {
      this.modal.close();
    };
  }

  function LocalTimeViewModel(engine, observatoryKeys, universalTimeKeys) {
    this.template = "modal-local-time";
    this.availableObservatories = observatoryKeys;
    this.selectedObservatory = ko.observable(observatoryKeys[0]);
    this.availableUniversalTimes = universalTimeKeys;
    this.selectedUniversalTime = ko.observable(universalTimeKeys[0]);
    this.submitForm = function() {
      var command = "LocalTime";
      var args = {};
      args.observatory = this.selectedObservatory();
      args.universalTime = this.selectedUniversalTime();
      engine.submit(command, args);
      this.modal.close();
    };
    this.cancelForm = function(data, event) {
      this.modal.close();
    };
  }

  function CoordinatesViewModel(engine) {
    this.template = "modal-coordinates";
    this.raHours = ko.observable(0);
    this.raMinutes = ko.observable(0);
    this.raSeconds = ko.observable(0);
    this.decDegrees = ko.observable(0);
    this.decMinutes = ko.observable(0);
    this.decSeconds = ko.observable(0);
    this.decNorthSouth = ko.observable('N');
    this.submitForm = function() {
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

      this.modal.close();
    };
    this.cancelForm = function(data, event) {
      this.modal.close();
    };
  }

  function PrecessionViewModel(engine, coordinateKeys, universalTimeKeys) {
    this.template = "modal-precession";
    this.availableCoordinates = coordinateKeys;
    this.selectedCoordinates = ko.observable(coordinateKeys[0]);
    this.availableUniversalTimes = universalTimeKeys;
    this.selectedUniversalTime = ko.observable(universalTimeKeys[0]);
    this.submitForm = function() {
      var command = "Precession";
      var args = {};
      args.coordinates = this.selectedCoordinates();
      args.universalTime = this.selectedUniversalTime();
      engine.submit(command, args);
      this.modal.close();
    };
    this.cancelForm = function(data, event) {
      this.modal.close();
    };
  }

  function TransformationViewModel(engine, coordinateKeys, localTimeKeys) {
    this.template = "modal-transformation";
    this.availableCoordinates = coordinateKeys;
    this.selectedCoordinates = ko.observable(coordinateKeys[0]);
    this.availableLocalTimes = localTimeKeys;
    this.selectedLocalTime = ko.observable(localTimeKeys[0]);
    this.submitForm = function() {
      var command = "Transformation";
      var args = {};
      args.coordinates = this.selectedCoordinates();
      args.localTime = this.selectedLocalTime();
      args.to = "Hor";
      engine.submit(command, args);
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

  return { viewModel: AstroCalcViewModel, template: templateMarkup };
});
