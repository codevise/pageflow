import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import {EditMetaDataView, editor} from 'pageflow/editor';
import {CheckBoxInputView} from 'pageflow/ui';

import {factories} from '$support';
import {ConfigurationEditor} from '$support/dominos/ui';

describe('EditMetaDataView', () => {
  it('renders general tab', () => {
    const entry = factories.entry();
    const view = new EditMetaDataView({
      model: entry,
      tab: 'general',
      state: {
        config: {}
      }
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
      appearanceInputs: (the_view, the_entry, theming) => {
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
      }
    });

    view.render();
    var configurationEditor = ConfigurationEditor.find(view);

    expect(configurationEditor.tabNames()).toEqual(expect.arrayContaining(['social']));
    expect(configurationEditor.inputPropertyNames()).toEqual(expect.arrayContaining([
      'share_image_id', 'summary', 'share_url', 'share_providers'
    ]));
  });
});
