import React from 'react';

import {EditableLink} from 'frontend';
import {loadInlineEditingComponents} from 'frontend/inlineEditing';

import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect'

describe('EditableText', () => {
  beforeAll(loadInlineEditingComponents);

  it('renders children with className', () => {
    const {getByText} = render(
      <EditableLink className="custom">Some link</EditableLink>
    );

    expect(getByText('Some link')).toHaveClass('custom');
  });

  it('displays tooltip on hover if href is present', async () => {
    const {getByText, getByRole} = render(
      <EditableLink href="https://example.com">Some link</EditableLink>
    );

    const user = userEvent.setup();
    await user.hover(getByText('Some link'));

    expect(getByRole('link')).toHaveAttribute('href', 'https://example.com');
  });

  it('supports disabling hover tooltip', async () => {
    const {getByText, queryByRole} = render(
      <EditableLink href="https://example.com"
                    linkPreviewDisabled={true}>
        Some link
      </EditableLink>
    );

    const user = userEvent.setup();
    await user.hover(getByText('Some link'));

    expect(queryByRole('link')).toBeNull();
  });
});
