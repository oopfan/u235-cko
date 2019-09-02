define(['knockout', 'jquery', 'text!./g2v-star-database.html'], function(ko, jquery, templateMarkup) {

  function G2vStarDatabase(params) {
    var self = this;
    self.g2v_north = ko.observableArray();
    self.g2v_south = ko.observableArray();

    jquery.getJSON("/api/g2v/", function(data) {
      var g2vN = [], g2vS = [];
      var size = 15;
      while (data.stars.length > 0) {
        var star = data.stars.splice(0, 1)[0];
        if (star.de.charAt(0) === '-') {
          g2vS.push(star);
        }
        else {
          g2vN.push(star);
        }
      }
      while (g2vN.length > 0) {
        self.g2v_north.push(g2vN.splice(0, size));
      }
      while (g2vS.length > 0) {
        self.g2v_south.push(g2vS.splice(0, size));
      }
    });
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  G2vStarDatabase.prototype.dispose = function() { };

  return { viewModel: G2vStarDatabase, template: templateMarkup };

});
