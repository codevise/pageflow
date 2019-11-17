describe('FileSettingsDialogView', function() {
  var f = support.factories;

  support.setupGlobals({entry: f.entry});

  it('renders settingsDialogTabs of file type', function() {
    var fileType = f.fileType({
      settingsDialogTabs: [
        {name: 'custom', view: pageflow.TextInputView}
      ]
    });
    var view = new pageflow.FileSettingsDialogView({
      model: f.file({}, {
        fileType: fileType
      })
    });

    view.render();
    var tabView = support.dom.Tabs.find(view);

    expect(tabView.tabNames()).to.include('custom');
  });
});