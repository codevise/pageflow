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
    var configurationEditor = support.dom.ConfigurationEditorTab.find(view);

    expect(configurationEditor.inputPropertyNames()).to.contain('custom');
  });

  it('supports function for configurationEditorInputs option of file type', function() {
    var inputsFunction = sinon.spy(function(model) {
      return [
        {name: 'custom', inputView: pageflow.TextInputView}
      ];
    });
    var fileType = f.fileType({
      configurationEditorInputs: inputsFunction
    });
    var model = f.file({}, {
      fileType: fileType
    });
    var view = new pageflow.EditFileView({
      model: model,
      entry: new Backbone.Model()
    });

    view.render();
    var configurationEditor = support.dom.ConfigurationEditorTab.find(view);

    expect(configurationEditor.inputPropertyNames()).to.contain('custom');
    expect(inputsFunction).to.have.been.calledWith(model);
  });
});
