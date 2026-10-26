import React from 'react';

import {EditableText} from 'frontend';
import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';

import '@testing-library/jest-dom/extend-expect';
import {editableTextValue} from 'support';

describe('inline editing EditableText rendering', () => {
  useInlineEditingPageObjects();

  it('renders text from value', () => {
    const value = editableTextValue('Some text', {type: 'heading'});

    const entry = renderEntry({
      contentElement: {ui: <EditableText value={value} />}
    });

    expect(entry.queryByText('Some text')).toBeInTheDocument();
  });

  it('renders class name', () => {
    const value = editableTextValue('Some text', {type: 'heading'});

    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={value} className="some-class" />
      }
    });

    expect(entry.container.querySelector('.some-class')).toBeInTheDocument();
  });
});
