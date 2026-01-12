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
      state: {
        config: {}
      },
      editor: editor
    });

    view.render();
    var configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.tabNames()).toEqual(expect.arrayContaining(['widgets']));
    expect(configurationEditor.inputPropertyNames()).toEqual(expect.arrayContaining([
      'cheese'
    ]));
  });

  it('renders additional appearance inputs on widgets tab', () => {
    const entry = factories.entry();
    const editor = factories.editorApi();
    editor.registerAppearanceInputs(tabView => {
      tabView.input('cheese', CheckBoxInputView);
    });
    const view = new EditMetaDataView({
      model: entry,
      tab: 'widgets',
      state: {
        config: {}
      },
      editor
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
    'pageflow.entry_types.strange.editor.entry_metadata_configuration_attributes.quark.inline_help': 'Help yourself!',
    'pageflow.editor.entry_structured_data_types.article.label': 'Article',
    'pageflow.editor.entry_structured_data_types.faq_page.label': 'FAQ Page'
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
      state: {
        config: {}
      },
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
      state: {
        config: {}
      },
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
      state: {
        config: {},
        themes: {
          findByName: () => factories.theme(),
          length: 2,
        }
      },
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

  it('renders structured_data_type_name input on general tab when multiple types available', () => {
    editor.registerEntryType('test');
    const entry = factories.entry({}, {type_name: 'test'});
    const view = new EditMetaDataView({
      model: entry,
      tab: 'general',
      state: {
        config: {
          entryStructuredDataTypes: ['article', 'faq_page']
        }
      },
      editor: editor
    });

    view.render();
    var configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.inputPropertyNames()).toEqual(expect.arrayContaining([
      'structured_data_type_name'
    ]));
  });

  it('does not render structured_data_type_name input when only one type available', () => {
    editor.registerEntryType('test');
    const entry = factories.entry({}, {type_name: 'test'});
    const view = new EditMetaDataView({
      model: entry,
      tab: 'general',
      state: {
        config: {
          entryStructuredDataTypes: ['article']
        }
      },
      editor: editor
    });

    view.render();
    var configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.inputPropertyNames()).not.toEqual(expect.arrayContaining([
      'structured_data_type_name'
    ]));
  });

  it('renders edit defaults button on widgets tab when entry type has editDefaultsView', () => {
    const entry = factories.entry();
    editor.registerEntryType('test', {
      editDefaultsView: function() {}
    });
    const view = new EditMetaDataView({
      model: entry,
      tab: 'widgets',
      state: {
        config: {}
      },
      editor: editor
    });

    view.render();

    expect(view.$el).toHaveDescendant('.edit_defaults_button');
  });

  it('does not render edit defaults button when entry type has no editDefaultsView', () => {
    const entry = factories.entry();
    editor.registerEntryType('test', {});
    const view = new EditMetaDataView({
      model: entry,
      tab: 'widgets',
      state: {
        config: {}
      },
      editor: editor
    });

    view.render();

    expect(view.$el).not.toHaveDescendant('.edit_defaults_button');
  });
});
