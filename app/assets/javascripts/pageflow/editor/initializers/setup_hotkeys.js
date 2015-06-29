pageflow.app.addInitializer(function(options) {
  var KEY_A = 65;

  $(document).on('keydown', function(event) {
    if (pageflow.features.isEnabled('atmo') && event.altKey && event.which === KEY_A) {
      if (pageflow.atmo.disabled) {
        pageflow.atmo.enable();
      }
      else {
        pageflow.atmo.disable();
      }
    }
  });
});