import React from 'react';

import {EditableText} from 'frontend';
import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';

import '@testing-library/jest-dom/extend-expect';

describe('inline editing EditableText placeholder', () => {
  useInlineEditingPageObjects();

  const headingValue = [{
    type: 'heading',
    children: [{text: 'Some text'}]
  }];

  const emptyParagraphValue = [{
    type: 'paragraph',
    children: [{text: ''}]
  }];

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
