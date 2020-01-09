define(["knockout", "snrcalc-datastore", "text!./snrcalc-camera-profiles.html"], function(ko, datastore, template) {

  function SnrCalcCameraProfilesViewModel(route) {

    this.profiles = datastore.cameraProfiles;

    this.addProfile = function() {
      console.log('addProfile!');
    };

    this.deleteProfile = function() {
      console.log('deleteProfile!');
    };

    this.rollbackChanges = function() {
      console.log('rollbackChanges!');
    };
  }

  return { viewModel: SnrCalcCameraProfilesViewModel, template: template };

});
