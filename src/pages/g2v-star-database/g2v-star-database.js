define(['knockout', 'text!./g2v-star-database.html'], function(ko, templateMarkup) {

  function G2vStarDatabase(params) {
    var self = this;
    self.hemispheres = ko.observableArray([
      {
        title: "Northern Hemisphere",
        tables: ko.observableArray()
      },
      {
        title: "Southern Hemisphere",
        tables: ko.observableArray()
      }
    ]);
    $.getJSON("/api/g2v/", function(data) {
      var g2vN = [], g2vS = [];
      while (data.stars.length > 0) {
        var star = data.stars.splice(0, 1)[0];
        if (star.de.charAt(0) === '-') {
          g2vS.push(star);
        }
        else {
          g2vN.push(star);
        }
      }
      var size = 15;
      var ntables = Math.ceil(g2vN.length / size);
      while (g2vN.length > 0) {
        self.hemispheres()[0].tables.push(
          {
            stars: ko.observableArray(g2vN.splice(0, size)),
            ntables: ko.observable(ntables)
          }
        );
      }
      ntables = Math.ceil(g2vS.length / size);
      while (g2vS.length > 0) {
        self.hemispheres()[1].tables.push(
          {
            stars: ko.observableArray(g2vS.splice(0, size)),
            ntables: ko.observable(ntables)
          }
        );
      }
    });
  }

  // This runs when the component is torn down. Put here any logic necessary to clean up,
  // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
  G2vStarDatabase.prototype.dispose = function() { };

  return { viewModel: G2vStarDatabase, template: templateMarkup };

});
