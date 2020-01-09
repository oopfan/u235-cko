define(["knockout", "snrcalc-datastore", "text!./snrcalc-telescope-profiles.html"], function(ko, datastore, template) {

  function SnrCalcTelescopeProfilesViewModel(route) {

    this.profiles = datastore.telescopeProfiles;

    this.addProfile = function() {
      console.log('addProfile!');
    };

    this.deleteProfile = function() {
      console.log('deleteProfile!');
    };

    this.addOpticalElement = function() {
      console.log('addOpticalElement!');
    };

    this.deleteOpticalElement = function() {
      console.log('deleteOpticalElement!');
    };

    this.rollbackChanges = function() {
      console.log('rollbackChanges!');
    };

  }

  return { viewModel: SnrCalcTelescopeProfilesViewModel, template: template };

});
