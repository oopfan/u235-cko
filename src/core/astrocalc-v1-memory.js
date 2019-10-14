define(['knockout'], function(ko) {
  function Memory(observableArray) {
    this.setValue = function(key, value) {
      var length = observableArray().length;
      for (var index = 0; index < length; index++) {
        if (observableArray()[index][0] === key) {
          observableArray()[index][1](value);
          return;
        }
      }
      observableArray.push([key, ko.observable(value)]);
    };
    this.getValue = function(key) {
      var length = observableArray().length;
      for (var index = 0; index < length; index++) {
        if (observableArray()[index][0] === key) {
          return observableArray()[index][1]();
        }
      }
      return {};
    };
    this.clearAll = function() {
      observableArray.removeAll();
    };
    this.getKeys = function() {
      var keys = [];
      var length = observableArray().length;
      for (var index = 0; index < length; index++) {
        keys.push(observableArray()[index][0]);
      }
      return keys;
    };
    this.getKeysByType = function(type) {
      var keys = [];
      var length = observableArray().length;
      for (var index = 0; index < length; index++) {
        if (observableArray()[index][1]().type === type) {
          keys.push(observableArray()[index][0]);
        }
      }
      return keys;
    };
  }
  return Memory;
});
