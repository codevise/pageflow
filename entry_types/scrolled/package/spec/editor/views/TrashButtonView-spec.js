import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {screen} from '@testing-library/dom';

import {editor} from 'pageflow-scrolled/editor';

import {TrashButtonView} from 'editor/views/TrashButtonView';

import {useFakeTranslations, renderBackboneView as render} from 'pageflow/testHelpers';

describe('TrashButtonView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.entry_outline.trash': 'Deleted content'
  });

  it('renders button with tooltip', () => {
    render(new TrashButtonView());

    expect(screen.getByRole('button', {name: 'Deleted content'}))
      .toHaveAttribute('title', 'Deleted content');
  });

  it('navigates to trash when clicked', async () => {
    const user = userEvent.setup();
    const navigate = jest.spyOn(editor, 'navigate').mockImplementation(() => {});
    render(new TrashButtonView());

    await user.click(screen.getByRole('button', {name: 'Deleted content'}));

    expect(navigate).toHaveBeenCalledWith('/scrolled/trash', {trigger: true});
    navigate.mockRestore();
  });
});
