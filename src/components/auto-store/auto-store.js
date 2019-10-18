define(['knockout', 'text!./auto-store.html'], function(ko, template) {

  function AutostoreViewModel(params) {
    this.autostoreEnable = params.autostoreEnable;
    this.autostoreLocation = params.autostoreLocation;
  }

  return { viewModel: AutostoreViewModel, template: template };
});
