pageflow.app.addInitializer(function(options) {
  var KEY_A = 65;
  var KEY_X = 88;

  $(document).on('keydown', function(event) {
    if (event.altKey && event.which === KEY_A) {
      if (pageflow.atmo.disabled) {
        pageflow.atmo.enable();
      }
      else {
        pageflow.atmo.disable();
      }
    }
    else if (event.altKey && event.which === KEY_X) {
      pageflow.editor.navigate('pages/' + pageflow.slides.currentPage().data('id'), {trigger: true});
    }
  });
});