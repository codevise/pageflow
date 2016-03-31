pageflow.app.addInitializer(function(options) {
  pageflow.editLock = new pageflow.EditLockContainer();

  pageflow.editLock.watchForErrors();
  pageflow.editLock.acquire();
});