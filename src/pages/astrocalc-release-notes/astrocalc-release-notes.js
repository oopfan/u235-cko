define(['knockout', 'text!./astrocalc-release-notes.html'],
  function (ko, templateMarkup) {

  function AstroCalcReleaseNotesViewModel() {
  }

  return { viewModel: AstroCalcReleaseNotesViewModel, template: templateMarkup };
});
