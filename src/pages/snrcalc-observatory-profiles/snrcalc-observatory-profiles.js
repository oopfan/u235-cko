define(["knockout", "snrcalc-datastore", "text!./snrcalc-observatory-profiles.html"], function(ko, datastore, template) {

  function SnrCalcObservatoryProfilesViewModel(route) {

    this.profiles = datastore.observatoryProfiles;

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

  return { viewModel: SnrCalcObservatoryProfilesViewModel, template: template };
});
