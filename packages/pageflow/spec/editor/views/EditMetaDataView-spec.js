import Marionette from 'backbone.marionette';

import {EditMetaDataView, editor} from '$pageflow/editor';
import {CheckBoxInputView} from '$pageflow/ui';

import {factories} from '$support';

describe('EditMetaDataView', () => {
  it('renders entry type specific appearance inputs', () => {
    const entry = factories.entry();
    editor.registerEntryType('test', {
      appearanceInputs: (the_view, the_entry, theming) => {
        the_view.input('with_added_cheese', CheckBoxInputView);
      }
    });
    const view = new EditMetaDataView({model: entry, tab: 'widgets'});

    view.render();

    expect(view.$el).toHaveDescendant('.entry_with_added_cheese');
  });
});
