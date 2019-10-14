define(function() {
  function Accumulator(observableArray) {
    this.setValue = function(value) {
      observableArray.removeAll();
      observableArray.push(value);
    };
    this.getValue = function() {
      return observableArray().length > 0 ? observableArray()[0] : {};
    };
    this.clearAll = function() {
      observableArray.removeAll();
    };
  };
  return Accumulator;
});
