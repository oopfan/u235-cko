define(['knockout', 'ko-modal-helper', 'scroll-view', 'text!./color-balance-instructions.html'], function(ko, modalHelper, scrollView, templateMarkup) {

  function ColorBalanceInstructions() {
    this.scrollTo = function(data, event) {
      var id = $(event.target).attr('href');
      scrollView(id);
    };
    this.superSizeIt = function(data, event) {
      var imgSrc = $(event.target).attr('src');
      var modalTitle = $(event.target).attr("alt");
      modalHelper.showModal({
        viewModel: new ModalViewModel(imgSrc, modalTitle),
        context: this
      });
    };
  }

  function ModalViewModel(imgSrc, modalTitle) {
    this.template = "modal-img-full";
    this.imgSrc = ko.observable(imgSrc);
    this.modalTitle = ko.observable(modalTitle);
  }

  ColorBalanceInstructions.prototype.dispose = function() {};

  return { viewModel: ColorBalanceInstructions, template: templateMarkup };
});
