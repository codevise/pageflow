import React from 'react';

import {loadInlineEditingComponents} from 'frontend/inlineEditing';
import {useSelectLinkDestination} from 'frontend/inlineEditing/useSelectLinkDestination';
import {EditableLink} from 'frontend';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect'

jest.mock('frontend/inlineEditing/useSelectLinkDestination');

describe('EditableLink', () => {
  useFakeTranslations({
    'pageflow_scrolled.inline_editing.change_link_destination': 'Change link destination',
    'pageflow_scrolled.inline_editing.select_link_destination': 'Select link destination',
    'pageflow_scrolled.inline_editing.remove_link': 'Remove link'
  });

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

  it('does not render action button by default', async () => {
    render(
      <EditableLink>Some text</EditableLink>
    );

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('render action button when element is selected by default', async () => {
    renderInContentElement(
      <EditableLink>Some text</EditableLink>,
      {
        editorState: {isSelected: true}
      }
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('supports hiding action button even when selected', async () => {
    renderInContentElement(
      <EditableLink actionButtonVisible={false}>Some text</EditableLink>,
      {
        editorState: {isSelected: true}
      }
    );

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('supports showing action button even when not selected', async () => {
    render(
      <EditableLink actionButtonVisible={true}>Some text</EditableLink>,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders remove link button when href is present and allowRemove is true', () => {
    render(
      <EditableLink href="https://example.com" allowRemove={true} actionButtonVisible={true}>Some link</EditableLink>
    );

    expect(screen.getByRole('button', {name: 'Remove link'})).toBeInTheDocument();
  });

  it('does not render remove link button when allowRemove is false', () => {
    render(
      <EditableLink href="https://example.com" actionButtonVisible={true}>Some link</EditableLink>
    );

    expect(screen.queryByRole('button', {name: 'Remove link'})).toBeNull();
  });

  it('does not render remove link button when href is missing even if allowRemove is true', () => {
    render(
      <EditableLink allowRemove={true} actionButtonVisible={true}>Some link</EditableLink>
    );

    expect(screen.queryByRole('button', {name: 'Remove link'})).toBeNull();
  });

  it('triggers onChange with selected link when clicking change link button', async () => {
    const selectLinkDestination = jest.fn().mockResolvedValue('new link');
    useSelectLinkDestination.mockReturnValue(selectLinkDestination);
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(
      <EditableLink href="https://example.com" allowRemove={true} actionButtonVisible={true} onChange={onChange}>
        Some link
      </EditableLink>
    );

    await user.click(screen.getByRole('button', {name: 'Change link destination'}));

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('new link'));
  });

  it('triggers onChange with null when clicking remove link button', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(
      <EditableLink href="https://example.com" allowRemove={true} actionButtonVisible={true} onChange={onChange}>
        Some link
      </EditableLink>
    );

    await user.click(screen.getByRole('button', {name: 'Remove link'}));

    expect(onChange).toHaveBeenCalledWith(null);
  });
});
