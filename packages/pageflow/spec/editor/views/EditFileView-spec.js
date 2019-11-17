describe('EditFileView', () => {
  var f = support.factories;

  test('renders configurationEditorInputs of file type', () => {
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

    expect(configurationEditor.inputPropertyNames()).toEqual(expect.arrayContaining(['custom']));
  });

  test(
    'supports function for configurationEditorInputs option of file type',
    () => {
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

      expect(configurationEditor.inputPropertyNames()).toEqual(expect.arrayContaining(['custom']));
      expect(inputsFunction).to.have.been.calledWith(model);
    }
  );
});
