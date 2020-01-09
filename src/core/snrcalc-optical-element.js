define(['knockout'], function(ko) {
  function OpticalElement() {
    this.name = ko.observable();
    this.reflectanceTransmittance = ko.observable();

    this.add = function() {
      console.log('Add button pressed!');
    }
  };
  return OpticalElement;
});
