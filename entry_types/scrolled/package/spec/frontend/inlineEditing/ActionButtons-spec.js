import React from 'react';

import {ActionButtons} from 'frontend/inlineEditing/ActionButtons';

import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import 'support/toHaveAncestorWithInlineStyle';

describe('ActionButtons', () => {
  it('renders icons and texts for each button', () => {
    const {getByRole} = render(
      <ActionButtons buttons={[{icon: 'pencil', text: 'Edit'}, {icon: 'link', text: 'Link'}]} />
    );

    const editButton = getByRole('button', {name: 'Edit'});
    const editIcon = editButton.querySelector('svg');
    const linkButton = getByRole('button', {name: 'Link'});

    expect(editIcon).toBeInTheDocument();
    expect(linkButton.querySelector('svg')).toBeInTheDocument();
  });

  it('supports size prop', () => {
    const {getByRole} = render(
      <ActionButtons buttons={[{icon: 'pencil', text: 'Edit'}]} size="lg" />
    );

    const button = getByRole('button', {name: 'Edit'});
    const icon = button.querySelector('svg');

    expect(button.className).toEqual(expect.stringContaining('size-lg'));
    expect(icon).toHaveAttribute('width', '20');
    expect(icon).toHaveAttribute('height', '20');
  });

  it('can render button with icon only and text as aria-label', () => {
    const {getByRole} = render(
      <ActionButtons buttons={[{icon: 'pencil', text: 'Edit', iconOnly: true}]} />
    );

    const button = getByRole('button', {name: 'Edit'});

    expect(button).toHaveAttribute('aria-label', 'Edit');
    expect(button).toHaveAttribute('title', 'Edit');
    expect(button).toHaveTextContent('');
  });

  it('uses absolute position for floating element by default', () => {
    const {getByRole} = render(
      <ActionButtons buttons={[{icon: 'pencil', text: 'Edit'}]} />
    );

    expect(getByRole('button', {name: 'Edit'})).toHaveAncestorWithInlineStyle('position: absolute');
  });

  it('supports floatingStrategy prop', () => {
    const {getByRole} = render(
      <ActionButtons buttons={[{icon: 'pencil', text: 'Edit'}]}
                     floatingStrategy="fixed" />
    );

    expect(getByRole('button', {name: 'Edit'})).toHaveAncestorWithInlineStyle('position: fixed');
  });

  it('renders in portal with given id when portal is a string', () => {
    render(
      <ActionButtons buttons={[{icon: 'pencil', text: 'Edit'}]}
                     portal="aboveNavigationWidgets" />
    );

    const portalContainer = document.getElementById('floating-ui-above-navigation-widgets');
    expect(portalContainer).toBeInTheDocument();
    expect(portalContainer.querySelector('button')).toBeInTheDocument();
  });

  it('triggers individual click handlers', async () => {
    const onEdit = jest.fn();
    const onLink = jest.fn();
    const user = userEvent.setup();
    const {getByRole} = render(
      <ActionButtons buttons={[{icon: 'pencil', text: 'Edit', onClick: onEdit}, {icon: 'link', text: 'Link', onClick: onLink}]} />
    );

    await user.click(getByRole('button', {name: 'Edit'}));
    await user.click(getByRole('button', {name: 'Link'}));

    expect(onEdit).toHaveBeenCalled();
    expect(onLink).toHaveBeenCalled();
  });
});
