pageflow.app.addInitializer(function() {
  pageflow.app.on('error', function(e) {
    alert(I18n.t(e.name, {
      scope: 'pageflow.editor.errors',
      defaultValue: I18n.t('pageflow.editor.errors.unknown')
    }));
  });
});