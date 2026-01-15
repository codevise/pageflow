import {SelectMoveDestinationDialogView} from 'editor/views/SelectMoveDestinationDialogView';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories, normalizeSeed} from 'support';
import {useFakeTranslations, renderBackboneView as render} from 'pageflow/testHelpers';

import userEvent from '@testing-library/user-event';

describe('SelectMoveDestinationDialogView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.select_move_destination.header_insertPosition': 'Move section',
    'pageflow_scrolled.editor.select_move_destination.header_sectionPart': 'Move element',
    'pageflow_scrolled.editor.select_move_destination.hint': 'Select the position to move to.',
    'pageflow_scrolled.editor.select_move_destination.cancel': 'Cancel',
    'pageflow_scrolled.editor.selectable_section_item.title': 'Select section',
    'pageflow_scrolled.editor.selectable_section_item.insert_here': 'Move here',
    'pageflow_scrolled.editor.selectable_section_item.insert_at_beginning': 'Move to beginning',
    'pageflow_scrolled.editor.selectable_section_item.insert_at_end': 'Move to end'
  });

  it('renders title for insertPosition mode', () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [{id: 1, permaId: 10}]
      })
    });
    const view = new SelectMoveDestinationDialogView({
      entry,
      mode: 'insertPosition',
      onSelect: jest.fn()
    });

    const {getByRole} = render(view);

    expect(getByRole('heading', {name: 'Move section'})).toBeTruthy();
  });

  it('renders title for sectionPart mode', () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [{id: 1, permaId: 10}]
      })
    });
    const view = new SelectMoveDestinationDialogView({
      entry,
      mode: 'sectionPart',
      onSelect: jest.fn()
    });

    const {getByRole} = render(view);

    expect(getByRole('heading', {name: 'Move element'})).toBeTruthy();
  });

  it('allows selecting section in insertPosition mode', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [
          {id: 1, permaId: 10}
        ]
      })
    });
    const listener = jest.fn();
    const view = new SelectMoveDestinationDialogView({
      entry,
      mode: 'insertPosition',
      onSelect: listener
    });

    const user = userEvent.setup();
    const {getAllByText} = render(view);
    await user.click(getAllByText('Move here')[0]);

    expect(listener).toHaveBeenCalledWith({
      section: entry.sections.get(1),
      position: 'before'
    });
  });

  it('allows selecting section part in sectionPart mode', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [
          {id: 1, permaId: 10}
        ]
      })
    });
    const listener = jest.fn();
    const view = new SelectMoveDestinationDialogView({
      entry,
      mode: 'sectionPart',
      onSelect: listener
    });

    const user = userEvent.setup();
    const {getByText} = render(view);
    await user.click(getByText('Move to beginning'));

    expect(listener).toHaveBeenCalledWith({
      section: entry.sections.get(1),
      part: 'beginning'
    });
  });

  it('closes when section is selected', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [
          {id: 1, permaId: 10}
        ]
      })
    });
    const view = new SelectMoveDestinationDialogView({
      entry,
      mode: 'insertPosition',
      onSelect: jest.fn()
    });
    view.close = jest.fn();

    const user = userEvent.setup();
    const {getAllByText} = render(view);
    await user.click(getAllByText('Move here')[0]);

    expect(view.close).toHaveBeenCalled();
  });

  it('closes when cancel button is clicked', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [{id: 1}]
      })
    });
    const view = new SelectMoveDestinationDialogView({
      entry,
      mode: 'insertPosition',
      onSelect: jest.fn()
    });
    view.close = jest.fn();

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Cancel'}));

    expect(view.close).toHaveBeenCalled();
  });
});
