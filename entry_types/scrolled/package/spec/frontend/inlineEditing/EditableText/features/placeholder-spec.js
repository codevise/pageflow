import React from 'react';

import {EditableText} from 'frontend';
import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';

import '@testing-library/jest-dom/extend-expect';
import {editableTextValue} from 'support';

describe('inline editing EditableText placeholder', () => {
  useInlineEditingPageObjects();

  const headingValue = editableTextValue('Some text', {type: 'heading'});

  const emptyParagraphValue = editableTextValue('');

  it('renders placeholder if value is undefined', () => {
    const entry = renderEntry({
      contentElement: {ui: <EditableText placeholder="Some placeholder" />}
    });

    expect(entry.queryByText('Some placeholder')).toBeInTheDocument();
  });

  it('renders placeholder if value is empty', () => {
    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={emptyParagraphValue} placeholder="Some placeholder" />
      }
    });

    expect(entry.queryByText('Some placeholder')).toBeInTheDocument();
  });

  it('renders placeholder if value is empty array', () => {
    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={[]} placeholder="Some placeholder" />
      }
    });

    expect(entry.queryByText('Some placeholder')).toBeInTheDocument();
  });

  it('does not render placeholder if value is present', () => {
    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={headingValue} placeholder="Some placeholder" />
      }
    });

    expect(entry.queryByText('Some placeholder')).not.toBeInTheDocument();
  });

  it('supports rendering custom placeholder class name', () => {
    const entry = renderEntry({
      contentElement: {
        ui: <EditableText placeholder="Some placeholder"
                          placeholderClassName="custom-placeholder" />
      }
    });

    expect(entry.container.querySelector('.custom-placeholder')).toBeInTheDocument();
  });

  it('does not render custom placeholder class name when not blank', () => {
    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={headingValue}
                          placeholder="Some placeholder"
                          placeholderClassName="custom-placeholder" />
      }
    });

    expect(entry.container.querySelector('.custom-placeholder')).not.toBeInTheDocument();
  });
});
