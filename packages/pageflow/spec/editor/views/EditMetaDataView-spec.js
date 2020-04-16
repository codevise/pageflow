import Backbone from 'backbone';

import {EditMetaDataView, editor} from 'pageflow/editor';
import {CheckBoxInputView} from 'pageflow/ui';

import * as support from '$support';
import {ConfigurationEditor} from '$support/dominos/ui';

describe('EditMetaDataView', () => {
  const factories = support.factories;

  it('renders general tab', () => {
    editor.registerEntryType('test');
    const entry = factories.entry({}, {type_name: 'test'});
    const view = new EditMetaDataView({
      model: entry,
      tab: 'general',
      state: {
        config: {}
      },
      editor: editor
    });

    view.render();
    var configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.tabNames()).toEqual(expect.arrayContaining(['general']));
    expect(configurationEditor.inputPropertyNames()).toEqual(expect.arrayContaining([
      'title', 'locale', 'credits', 'author', 'publisher', 'keywords'
    ]));
  });

  it('renders entry type specific appearance inputs on widgets tab', () => {
    const entry = factories.entry();
    editor.registerEntryType('test', {
      appearanceInputs: (the_view, _options) => {
        the_view.input('cheese', CheckBoxInputView);
      }
    });
    const view = new EditMetaDataView({
      model: entry,
      tab: 'widgets',
      editor: editor
    });

    view.render();
    var configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.tabNames()).toEqual(expect.arrayContaining(['widgets']));
    expect(configurationEditor.inputPropertyNames()).toEqual(expect.arrayContaining([
      'cheese'
    ]));
  });

  support.useFakeTranslations({
    'pageflow.entry_types.strange.editor.entry_metadata_configuration_attributes.quark.label': 'Up',
    'pageflow.entry_types.strange.editor.entry_metadata_configuration_attributes.quark.inline_help': 'Help yourself!'
  });

  it('uses entry type-specific translation keys if provided', () => {
    const entry = factories.entry();
    editor.registerEntryType('strange', {
      appearanceInputs: (the_view, _options) => {
        the_view.input('quark', CheckBoxInputView);
      }
    });
    const view = new EditMetaDataView({
      model: entry,
      tab: 'widgets',
      editor: editor
    });

    view.render();
    var configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.inputLabels()).toEqual(expect.arrayContaining([
      'Up'
    ]));
    expect(configurationEditor.inlineHelpTexts()).toEqual(expect.arrayContaining([
      'Help yourself!'
    ]));
  });

  it('renders widgets input on widgets tab', () => {
    const entry = factories.entry({}, {widgets: new Backbone.Collection()});
    editor.registerEntryType('test', {});
    const view = new EditMetaDataView({
      model: entry,
      tab: 'widgets',
      editor: editor
    });

    view.render();

    expect(view.$el).toHaveDescendant('.widgets');
  });

  it('renders theme input on widgets tab', () => {
    const entry = factories.entry();
    editor.registerEntryType('test', {});
    const view = new EditMetaDataView({
      model: entry,
      tab: 'widgets',
      state: {themes: {
        findByName: () => factories.theme(),
        length: 2,
      }},
      features: {
        isEnabled: () => true
      },
      editor: editor
    });

    view.render();
    var configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.tabNames()).toEqual(expect.arrayContaining(['widgets']));
    expect(configurationEditor.inputPropertyNames()).toEqual(expect.arrayContaining([
      'theme_name'
    ]));
  });

  it('renders social tab', () => {
    editor.registerEntryType('test');
    const entry = factories.entry();
    const view = new EditMetaDataView({
      model: entry,
      tab: 'social',
      state: {
        entry: {get: () => 'good'},
        config: {},
        imageFiles: {
          getByPermaId: () => factories.imageFile()
        }
      },
      editor: editor
    });

    view.render();
    var configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.tabNames()).toEqual(expect.arrayContaining(['social']));
    expect(configurationEditor.inputPropertyNames()).toEqual(expect.arrayContaining([
      'share_image_id', 'summary', 'share_url', 'share_providers'
    ]));
  });
});
