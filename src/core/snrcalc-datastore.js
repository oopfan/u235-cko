define(['knockout', "snrcalc-telescope-profile", "snrcalc-optical-element", "snrcalc-camera-profile", "snrcalc-observatory-profile", "snrcalc-target-profile"],
  function(ko, TelescopeProfile, OpticalElement, CameraProfile, ObservatoryProfile, TargetProfile) {

  var telescopeProfiles = ko.observableArray();
  var cameraProfiles = ko.observableArray();
  var observatoryProfiles = ko.observableArray();
  var targetProfiles = ko.observableArray();

  var loadTelescopeProfiles = function() {
    var telescope = new TelescopeProfile();
    telescope.name('William Optics ZenithStar 71');
    telescope.aperture('71');
    telescope.focalLength('418');
    telescope.centralObstruction('0');
    var opticalElement = new OpticalElement();
    opticalElement.name('Objective Lens');
    opticalElement.reflectanceTransmittance('0.99');
    telescope.opticalElements.push(opticalElement);
    telescopeProfiles.push(telescope);

    telescope = new TelescopeProfile();
    telescope.name('Vixen ED81S w/o reducer');
    telescope.aperture('81');
    telescope.focalLength('625');
    telescope.centralObstruction('0');
    opticalElement = new OpticalElement();
    opticalElement.name('Objective Lens');
    opticalElement.reflectanceTransmittance('0.99');
    telescope.opticalElements.push(opticalElement);
    telescopeProfiles.push(telescope);

    telescope = new TelescopeProfile();
    telescope.name('Vixen ED81S w/ 0.67x reducer');
    telescope.aperture('81');
    telescope.focalLength('418');
    telescope.centralObstruction('0');
    opticalElement = new OpticalElement();
    opticalElement.name('Objective Lens');
    opticalElement.reflectanceTransmittance('0.99');
    telescope.opticalElements.push(opticalElement);
    telescopeProfiles.push(telescope);
  }

  var loadCameraProfiles = function() {
    var camera = new CameraProfile();
    camera.name('Atik 314E');
    camera.pixelSize('4.65');
    camera.readNoise('5.3');
    camera.darkCurrent('0');
    camera.quantumEfficiency('43');
    cameraProfiles.push(camera);

    camera = new CameraProfile();
    camera.name('ZWO ASI1600');
    camera.pixelSize('3.8');
    camera.readNoise('1.4');
    camera.darkCurrent('0');
    camera.quantumEfficiency('60');
    cameraProfiles.push(camera);
  }

  var loadObservatoryProfiles = function() {
    var observatory = new ObservatoryProfile();
    observatory.name('Mill Observatory');
    observatory.bortleClass('5');
    observatory.skyBrightness('20.25');
    observatoryProfiles.push(observatory);

    observatory = new ObservatoryProfile();
    observatory.name("Dave's Observatory");
    observatory.bortleClass('6');
    observatory.skyBrightness('19.25');
    observatoryProfiles.push(observatory);
  }

  var loadTargetProfiles = function() {
    var target = new TargetProfile();
    target.name("M81 Bode's Galaxy");
    target.surfaceBrightness('21.7');
    targetProfiles.push(target);

    target = new TargetProfile();
    target.name('M82 Cigar Galaxy');
    target.surfaceBrightness('21.2');
    targetProfiles.push(target);
  }

  var load = function() {
    loadTelescopeProfiles();
    loadCameraProfiles();
    loadObservatoryProfiles();
    loadTargetProfiles();
  }

  var store = function() {
  }

  return {
      telescopeProfiles: telescopeProfiles,
      cameraProfiles: cameraProfiles,
      observatoryProfiles: observatoryProfiles,
      targetProfiles: targetProfiles,
      load: load,
      store: store
  };

});
