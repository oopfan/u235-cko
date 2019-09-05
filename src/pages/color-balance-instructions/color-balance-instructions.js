define(['knockout', 'text!./color-balance-instructions.html'], function(ko, templateMarkup) {

  function ColorBalanceInstructions() {
    var self = this;
  }

  ColorBalanceInstructions.prototype.dispose = function() {};

  return { viewModel: ColorBalanceInstructions, template: templateMarkup };
});
