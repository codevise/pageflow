import Backbone from 'backbone';

import {TextInputView} from 'pageflow/ui';

import {EditFileView} from 'pageflow/editor';

import * as support from '$support';
import sinon from 'sinon';
import {ConfigurationEditorTab} from '$support/dominos/ui';

describe('EditFileView', () => {
  var f = support.factories;

  it('renders configurationEditorInputs of file type', () => {
    var fileType = f.fileType({
      configurationEditorInputs: [
        {name: 'custom', inputView: TextInputView}
      ]
    });
    var view = new EditFileView({
      model: f.file({}, {
        fileType: fileType
      }),
      entry: new Backbone.Model()
    });

    view.render();
    var configurationEditor = ConfigurationEditorTab.find(view);

    expect(configurationEditor.inputPropertyNames()).toEqual(expect.arrayContaining(['custom']));
  });

  it(
    'supports function for configurationEditorInputs option of file type',
    () => {
      var inputsFunction = sinon.spy(function(model) {
        return [
          {name: 'custom', inputView: TextInputView}
        ];
      });
      var fileType = f.fileType({
        configurationEditorInputs: inputsFunction
      });
      var model = f.file({}, {
        fileType: fileType
      });
      var view = new EditFileView({
        model: model,
        entry: new Backbone.Model()
      });

      view.render();
      var configurationEditor = ConfigurationEditorTab.find(view);

      expect(configurationEditor.inputPropertyNames()).toEqual(expect.arrayContaining(['custom']));
      expect(inputsFunction).toHaveBeenCalledWith(model);
    }
  );
});
