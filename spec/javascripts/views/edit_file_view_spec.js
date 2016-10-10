describe('EditFileView', function() {
  var f = support.factories;

  it('renders configurationEditorInputs of file type', function() {
    var fileType = f.fileType({
      configurationEditorInputs: [
        {name: 'custom', inputView: pageflow.TextInputView}
      ]
    });
    var view = new pageflow.EditFileView({
      model: f.file({}, {
        fileType: fileType
      }),
      entry: new Backbone.Model()
    });

    view.render();
    var configurationEditor = support.dom.ConfigurationEditor.find(view);

    expect(configurationEditor.inputPropertyNames()).to.contain('custom');
  });
});
