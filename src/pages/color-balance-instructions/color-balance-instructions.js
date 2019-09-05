define(['knockout', 'scroll-view', 'text!./color-balance-instructions.html'], function(ko, scrollView, templateMarkup) {

  function ColorBalanceInstructions() {
    this.scrollTo = function(data, event) {
      var id = $(event.target).attr('href');
      scrollView(id);
    }
  }

  ColorBalanceInstructions.prototype.dispose = function() {};

  return { viewModel: ColorBalanceInstructions, template: templateMarkup };
});
