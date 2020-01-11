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
    camera.name('Altair 290M');
    camera.pixelSize('2.9');
    camera.readNoise('1.55');
    camera.darkCurrent('0');
    camera.quantumEfficiency('65');
    cameraProfiles.push(camera);

    camera = new CameraProfile();
    camera.name('ZWO ASI1600');
    camera.pixelSize('3.8');
    camera.readNoise('1.4');
    camera.darkCurrent('0');
    camera.quantumEfficiency('55');
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

    observatory = new ObservatoryProfile();
    observatory.name("Bortle 1");
    observatory.bortleClass('1');
    observatory.skyBrightness('22');
    observatoryProfiles.push(observatory);

    observatory = new ObservatoryProfile();
    observatory.name("Bortle 2");
    observatory.bortleClass('2');
    observatory.skyBrightness('21.93');
    observatoryProfiles.push(observatory);

    observatory = new ObservatoryProfile();
    observatory.name("Bortle 3");
    observatory.bortleClass('3');
    observatory.skyBrightness('21.81');
    observatoryProfiles.push(observatory);

    observatory = new ObservatoryProfile();
    observatory.name("Bortle 4");
    observatory.bortleClass('4');
    observatory.skyBrightness('21.51');
    observatoryProfiles.push(observatory);

    observatory = new ObservatoryProfile();
    observatory.name("Bortle 5");
    observatory.bortleClass('5');
    observatory.skyBrightness('20.02');
    observatoryProfiles.push(observatory);

    observatory = new ObservatoryProfile();
    observatory.name("Bortle 6");
    observatory.bortleClass('6');
    observatory.skyBrightness('19.23');
    observatoryProfiles.push(observatory);

    observatory = new ObservatoryProfile();
    observatory.name("Bortle 7");
    observatory.bortleClass('7');
    observatory.skyBrightness('18.67');
    observatoryProfiles.push(observatory);

    observatory = new ObservatoryProfile();
    observatory.name("Bortle 8");
    observatory.bortleClass('8');
    observatory.skyBrightness('18.09');
    observatoryProfiles.push(observatory);

    observatory = new ObservatoryProfile();
    observatory.name("Bortle 9");
    observatory.bortleClass('9');
    observatory.skyBrightness('17.8');
    observatoryProfiles.push(observatory);
  }

  var loadTargetProfiles = function() {
    var target = new TargetProfile();
    target.name("M1 Crab Nebula");
    target.surfaceBrightness('20.5');
    targetProfiles.push(target);

    target = new TargetProfile();
    target.name("M27 Dumbbell Nebula");
    target.surfaceBrightness('20.2');
    targetProfiles.push(target);

    target = new TargetProfile();
    target.name("M51 Whirlpool Galaxy");
    target.surfaceBrightness('21.7');
    targetProfiles.push(target);

    target = new TargetProfile();
    target.name("M57 Ring Nebula");
    target.surfaceBrightness('19.6');
    targetProfiles.push(target);

    target = new TargetProfile();
    target.name("M63 Sunflower Galaxy");
    target.surfaceBrightness('22.1');
    targetProfiles.push(target);

    target = new TargetProfile();
    target.name("M64 Blackeye Galaxy");
    target.surfaceBrightness('21.5');
    targetProfiles.push(target);

    target = new TargetProfile();
    target.name("M76 Little Dumbbell Nebula");
    target.surfaceBrightness('21.2');
    targetProfiles.push(target);

    target = new TargetProfile();
    target.name("M81 Bode's Galaxy");
    target.surfaceBrightness('21.7');
    targetProfiles.push(target);

    target = new TargetProfile();
    target.name('M82 Cigar Galaxy');
    target.surfaceBrightness('21.2');
    targetProfiles.push(target);

    target = new TargetProfile();
    target.name("M94 Croc's Eye Galaxy");
    target.surfaceBrightness('22.4');
    targetProfiles.push(target);

    target = new TargetProfile();
    target.name("M97 Owl Nebula");
    target.surfaceBrightness('20.8');
    targetProfiles.push(target);

    target = new TargetProfile();
    target.name("M101 Pinwheel Galaxy");
    target.surfaceBrightness('23.8');
    targetProfiles.push(target);

    target = new TargetProfile();
    target.name("M106 (a galaxy)");
    target.surfaceBrightness('22.3');
    targetProfiles.push(target);

    target = new TargetProfile();
    target.name("M109 (a galaxy)");
    target.surfaceBrightness('22.2');
    targetProfiles.push(target);

    target = new TargetProfile();
    target.name("NGC 4565 Needle Galaxy");
    target.surfaceBrightness('22.0');
    targetProfiles.push(target);

    target = new TargetProfile();
    target.name("NGC 4631 Herring Galaxy");
    target.surfaceBrightness('21.9');
    targetProfiles.push(target);

    target = new TargetProfile();
    target.name("Mag 17 Star / Poor Seeing");
    target.surfaceBrightness('20');
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
