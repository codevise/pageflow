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
});
