define(['knockout', 'text!./color-balance.html'], function(ko, templateMarkup) {

  function ColorBalance() {
    var self = this;
  }

  ColorBalance.prototype.dispose = function() {};

  return { viewModel: ColorBalance, template: templateMarkup };
});
