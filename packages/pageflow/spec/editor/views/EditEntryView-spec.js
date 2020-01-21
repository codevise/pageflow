import Marionette from 'backbone.marionette';

import {EditEntryView, editor} from 'pageflow/editor';

import {factories} from '$support';

describe('EditEntryView', () => {
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
});
