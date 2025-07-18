import Backbone from 'backbone';

import {TextInputView} from 'pageflow/ui';

import {EditFileView, editor} from 'pageflow/editor';
import {state} from '$state';

import * as support from '$support';
import {useFakeTranslations} from 'pageflow/testHelpers';
import sinon from 'sinon';
import {within} from '@testing-library/dom';
import {ConfigurationEditorTab} from '$support/dominos/ui';

describe('EditFileView', () => {
  var f = support.factories;

  useFakeTranslations({
    'pageflow.editor.files.common_attributes.source_url.label': 'Source URL',
    'pageflow.editor.files.common_attributes.license.label': 'License',
    'pageflow.file_licenses.cc0.name': 'CC0',
    'pageflow.entry_types.strange.editor.files.attributes.image_files.custom.label': 'Entry Label',
    'pageflow.editor.files.attributes.image_files.custom.label': 'Fallback Label'
  });

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

  it('does not render extended file rights fields by default', () => {
    var view = new EditFileView({
      model: f.file(),
      entry: new Backbone.Model()
    });

    view.render();
    const {queryByLabelText} = within(view.el);

    expect(queryByLabelText('Source URL')).toBeNull();
  });

  it('uses entry type-specific translation keys if provided', () => {
    editor.registerEntryType('strange');
    const fileType = f.fileType({
      configurationEditorInputs: [
        {name: 'custom', inputView: TextInputView}
      ]
    });
    const view = new EditFileView({
      model: f.file({}, {fileType}),
      entry: new Backbone.Model()
    });

    view.render();
    const configurationEditor = ConfigurationEditorTab.find(view);

    expect(configurationEditor.inputLabels()).toEqual(expect.arrayContaining(['Entry Label']));
  });

  it('falls back to generic translation keys', () => {
    editor.registerEntryType('other');
    const fileType = f.fileType({
      configurationEditorInputs: [
        {name: 'custom', inputView: TextInputView}
      ]
    });
    const view = new EditFileView({
      model: f.file({}, {fileType}),
      entry: new Backbone.Model()
    });

    view.render();
    const configurationEditor = ConfigurationEditorTab.find(view);

    expect(configurationEditor.inputLabels()).toEqual(expect.arrayContaining(['Fallback Label']));
  });

  it('renders extended file rights fields if supported by entry type', () => {
    editor.registerEntryType('test', {
      supportsExtendedFileRights: true
    });
    var view = new EditFileView({
      model: f.file(),
      entry: new Backbone.Model()
    });

    view.render();
    const {queryByLabelText} = within(view.el);

    expect(queryByLabelText('Source URL')).not.toBeNull();
  });

  it('renders licenses from config', () => {
    editor.registerEntryType('test', {
      supportsExtendedFileRights: true
    });
    state.config.availableFileLicenses = ['cc0'];
    var view = new EditFileView({
      model: f.file(),
      entry: new Backbone.Model()
    });

    view.render();
    const {getByLabelText} = within(view.el);
    const {getByRole} = within(getByLabelText('License'))

    expect(getByRole('option', {name: 'CC0'})).not.toBeNull();
  });

  it('does not render extended file rights fields if non supported by file type', () => {
    var fileType = f.fileType({
      noExtendedFileRights: true
    });
    var model = f.file({}, {
      fileType: fileType
    });
    var view = new EditFileView({
      model,
      entry: new Backbone.Model()
    });

    view.render();
    const {queryByLabelText} = within(view.el);

    expect(queryByLabelText('Source URL')).toBeNull();
  });
});
