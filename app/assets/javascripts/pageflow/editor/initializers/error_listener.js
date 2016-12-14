pageflow.app.addInitializer(function() {
  pageflow.app.on('error', function(e) {
    if (e.message) {
      alert(e.message);
    }
    else {
      alert(I18n.t(e.name, {
        scope: 'pageflow.editor.errors',
        defaultValue: I18n.t('pageflow.editor.errors.unknown')
      }));
    }
  });
});
