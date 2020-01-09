define(['knockout', "snrcalc-datastore", 'text!./app.html'], function(ko, datastore, template) {

  function App(params) {
    this.route = params.route;
    datastore.load();
  }

  return { viewModel: App, template: template };
});
