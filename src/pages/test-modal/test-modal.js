define(["knockout", "ko-modal-helper", "text!./test-modal.html"], function(ko, modalHelper, testModalTemplate) {

  var AppViewModel = function(params) {
      this.notes = ko.observableArray();
  };

  AppViewModel.prototype.addNote = function() {
      modalHelper.showModal({
          viewModel: new AddNoteViewModel(),
          context: this // Set context so we don't need to bind the callback function
      })
      .done(function(result) {
        //console.log("Modal closed with result: ", result);
        this._addNoteToNotes(result);
      })
      .fail(function() {
        //console.log("Modal cancelled");
      });
  };

  AppViewModel.prototype._addNoteToNotes = function(newNote) {
      this.notes.push(newNote);
  };

  var AddNoteViewModel = function() {
      this.text = ko.observable();
      this.important = ko.observable();
  };

  // The name of the template to render
  AddNoteViewModel.prototype.template = "add-note";

  AddNoteViewModel.prototype.add = function () {
      var newNote = {
          text: this.text(),
          important: this.important()
      };
      // Close the modal, passing the new note object as the result data.
      this.modal.close(newNote);
  };

  AddNoteViewModel.prototype.cancel = function () {
      // Close the modal without passing any result data.
      this.modal.close();
  };

  return { viewModel: AppViewModel, template: testModalTemplate };

});
