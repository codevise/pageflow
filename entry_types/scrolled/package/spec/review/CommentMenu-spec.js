import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {CommentMenu} from 'review/CommentMenu';
import EditIcon from 'review/images/edit.svg';
import {renderWithReviewState} from 'support/renderWithReviewState';

describe('CommentMenu', () => {
  function menu(props) {
    return (
      <CommentMenu label="Comment actions"
                   items={[{icon: EditIcon, label: 'Edit', onSelect: () => {}}]}
                   {...props} />
    );
  }

  it('only renders the menu once the button has been clicked', async () => {
    const user = userEvent.setup();

    const {getByRole, queryByRole} = renderWithReviewState(menu());

    expect(queryByRole('menu')).toBeNull();

    await user.click(getByRole('button', {name: 'Comment actions'}));

    expect(getByRole('menuitem', {name: 'Edit'})).toBeInTheDocument();
  });

  // The form styles in pageflow/ui/forms.scss turn buttons announcing a
  // popup into full width select lookalikes, but spare this value.
  it('announces a menu rather than a generic popup', () => {
    const {getByRole} = renderWithReviewState(menu());

    expect(getByRole('button', {name: 'Comment actions'}))
      .toHaveAttribute('aria-haspopup', 'menu');
  });

  it('exposes the expanded state of the menu', async () => {
    const user = userEvent.setup();

    const {getByRole} = renderWithReviewState(menu());
    const button = getByRole('button', {name: 'Comment actions'});

    expect(button).toHaveAttribute('aria-expanded', 'false');

    await user.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('invokes onSelect and closes the menu when the item is selected', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();

    const {getByRole, queryByRole} = renderWithReviewState(
      menu({items: [{icon: EditIcon, label: 'Edit', onSelect}]})
    );

    await user.click(getByRole('button', {name: 'Comment actions'}));
    await user.click(getByRole('menuitem', {name: 'Edit'}));

    expect(onSelect).toHaveBeenCalled();
    expect(queryByRole('menu')).toBeNull();
  });

  it('closes the menu on escape', async () => {
    const user = userEvent.setup();

    const {getByRole, queryByRole} = renderWithReviewState(menu());

    await user.click(getByRole('button', {name: 'Comment actions'}));
    await user.keyboard('{Escape}');

    expect(queryByRole('menu')).toBeNull();
  });

  // Enclosing popovers close themselves on Escape from a document
  // listener. React 16 dispatches from there too, so the menu has to claim
  // the key in the capture phase to still be the one that handles it.
  it('keeps Escape from reaching document listeners', async () => {
    const user = userEvent.setup();
    const listener = jest.fn();

    const {getByRole, queryByRole} = renderWithReviewState(menu());

    await user.click(getByRole('button', {name: 'Comment actions'}));

    document.addEventListener('keydown', listener);

    try {
      await user.keyboard('{Escape}');
    }
    finally {
      document.removeEventListener('keydown', listener);
    }

    expect(queryByRole('menu')).toBeNull();
    expect(listener).not.toHaveBeenCalled();
  });

  it('moves focus to items via arrow keys', async () => {
    const user = userEvent.setup();

    const {getByRole} = renderWithReviewState(menu());

    await user.click(getByRole('button', {name: 'Comment actions'}));
    await user.keyboard('{ArrowDown}');

    expect(getByRole('menuitem', {name: 'Edit'})).toHaveFocus();
  });

  // Threads act as a single click target for selecting their subject.
  it('does not let clicks reach enclosing click handlers', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    const {getByRole} = renderWithReviewState(
      <div onClick={onClick}>
        {menu()}
      </div>
    );

    await user.click(getByRole('button', {name: 'Comment actions'}));
    await user.click(getByRole('menuitem', {name: 'Edit'}));

    expect(onClick).not.toHaveBeenCalled();
  });
});
