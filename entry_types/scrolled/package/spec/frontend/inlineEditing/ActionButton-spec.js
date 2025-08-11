import React from 'react';

import {ActionButton} from 'frontend/inlineEditing/ActionButton';

import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

describe('ActionButton', () => {
  it('renders icon and text', () => {
    const {getByRole} = render(
      <ActionButton icon="pencil" text="Edit" />
    );

    const button = getByRole('button', {name: 'Edit'});
    const icon = button.querySelector('svg');

    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('width', '15');
    expect(icon).toHaveAttribute('height', '15');
  });

  it('supports size prop', () => {
    const {getByRole} = render(
      <ActionButton icon="pencil" text="Edit" size="lg" />
    );

    const button = getByRole('button', {name: 'Edit'});
    const icon = button.querySelector('svg');

    expect(button.className).toEqual(expect.stringContaining('size-lg'));
    expect(icon).toHaveAttribute('width', '20');
    expect(icon).toHaveAttribute('height', '20');
  });

  it('can render with icon only and text as aria-label', () => {
    const {getByRole} = render(
      <ActionButton icon="pencil" text="Edit" iconOnly />
    );

    const button = getByRole('button', {name: 'Edit'});

    expect(button).toHaveAttribute('aria-label', 'Edit');
    expect(button).toHaveAttribute('title', 'Edit');
    expect(button).toHaveTextContent('');
  });

  it('triggers click handler', async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();
    const {getByRole} = render(
      <ActionButton icon="pencil" text="Edit" onClick={onClick} />
    );

    await user.click(getByRole('button', {name: 'Edit'}));

    expect(onClick).toHaveBeenCalled();
  });
});

