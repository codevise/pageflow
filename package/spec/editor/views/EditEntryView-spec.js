import Marionette from 'backbone.marionette';

import {EditEntryView, editor} from 'pageflow/editor';

import {factories, useFakeTranslations} from '$support';

describe('EditEntryView', () => {
  useFakeTranslations({
    'some.key': 'some translation'
  });

  it('renders entry type specific outline', () => {
    const entry = factories.entry();
    editor.registerEntryType('test', {
      outlineView: Marionette.ItemView.extend({
        template() { return '<div class="test_outline"></div>'; }
      })
    });
    const view = new EditEntryView({model: entry});

    view.render();

    expect(view.$el).toHaveDescendant('.test_outline');
  });

  it('renders additional menu items', () => {
    const entry = factories.entry();
    editor.registerMainMenuItem({
      translationKey: 'some.key',
      id: 'some-id'
    });
    const view = new EditEntryView({model: entry});

    view.render();
    const item = view.$el.find('[data-main-menu-item="some-id"]');

    expect(item).toHaveText('some translation');
  });

  describe('menu item indicator', () => {
    function renderMenuItem(entry) {
      editor.registerMainMenuItem({
        translationKey: 'some.key',
        id: 'some-id',
        indicatorAttribute: 'somethingUnseen'
      });
      const view = new EditEntryView({model: entry});

      view.render();

      return view.$el.find('[data-main-menu-item="some-id"]');
    }

    it('is absent while the entry attribute is falsy', () => {
      const item = renderMenuItem(factories.entry());

      expect(item).not.toHaveClass('indicator');
    });

    it('is present while the entry attribute is truthy', () => {
      const item = renderMenuItem(factories.entry({somethingUnseen: true}));

      expect(item).toHaveClass('indicator');
    });

    it('follows changes of the entry attribute', () => {
      const entry = factories.entry();
      const item = renderMenuItem(entry);

      entry.set('somethingUnseen', true);

      expect(item).toHaveClass('indicator');

      entry.set('somethingUnseen', false);

      expect(item).not.toHaveClass('indicator');
    });
  });
});
