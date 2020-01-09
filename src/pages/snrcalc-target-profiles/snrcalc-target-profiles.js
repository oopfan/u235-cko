define(["knockout", "snrcalc-datastore", "text!./snrcalc-target-profiles.html"], function(ko, datastore, template) {

  function SnrCalcTargetProfilesViewModel(route) {

    this.profiles = datastore.targetProfiles;

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

  return { viewModel: SnrCalcTargetProfilesViewModel, template: template };
});
