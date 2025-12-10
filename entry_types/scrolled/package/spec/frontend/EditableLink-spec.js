import React from 'react';

import {EditableLink} from 'frontend';

import {renderInEntry} from 'support';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect'

// Link behavior is tested in Link-spec.js.
// These tests verify EditableLink correctly passes props to Link.

describe('EditableLink', () => {
  it('renders link', () => {
    const {getByRole} = renderInEntry(
      <EditableLink href="https://example.com">Some link</EditableLink>
    );

    expect(getByRole('link')).toHaveTextContent('Some link')
    expect(getByRole('link')).toHaveAttribute('href', 'https://example.com')
  });

  it('supports className', () => {
    const {getByRole} = renderInEntry(
      <EditableLink className="custom" href="https://example.com">Some link</EditableLink>
    );

    expect(getByRole('link')).toHaveClass('custom')
  });

  it('supports onClick', async () => {
    const onClick = jest.fn(event =>
      event.preventDefault() // Prevent jsdom warning
    );
    const user = userEvent.setup();
    const {getByRole} = renderInEntry(
      <EditableLink href="https://example.com" onClick={onClick}>Some link</EditableLink>
    );

    await user.click(getByRole('link'));

    expect(onClick).toHaveBeenCalled();
  });
});
