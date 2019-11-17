describe('FileSettingsDialogView', () => {
  var f = support.factories;

  support.setupGlobals({entry: f.entry});

  test('renders settingsDialogTabs of file type', () => {
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

    expect(tabView.tabNames()).toEqual(expect.arrayContaining(['custom']));
  });
});