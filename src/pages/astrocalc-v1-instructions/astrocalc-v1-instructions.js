define(['knockout', 'text!./astrocalc-v1-instructions.html'],
  function (ko, templateMarkup) {

  function AstroCalcInstructionsViewModel() {
  }

  return { viewModel: AstroCalcInstructionsViewModel, template: templateMarkup };
});
