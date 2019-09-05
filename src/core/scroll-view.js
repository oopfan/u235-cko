define(function() {

  return function(id) {
    $(id).each(function () {
      $('html, body').animate({
        scrollTop: $(this).offset().top - 80
      }, 1000);
    });
  };

});
