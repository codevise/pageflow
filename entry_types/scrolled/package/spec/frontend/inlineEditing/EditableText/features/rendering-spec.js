import React from 'react';

import {EditableText} from 'frontend';
import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';

import '@testing-library/jest-dom/extend-expect';

describe('inline editing EditableText rendering', () => {
  useInlineEditingPageObjects();

  beforeAll(() => window.getSelection = function() {});

  it('renders text from value', () => {
    const value = [{
      type: 'heading',
      children: [{text: 'Some text'}]
    }];

    const entry = renderEntry({
      contentElement: {ui: <EditableText value={value} />}
    });

    expect(entry.queryByText('Some text')).toBeInTheDocument();
  });

  it('renders class name', () => {
    const value = [{
      type: 'heading',
      children: [{text: 'Some text'}]
    }];

    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={value} className="some-class" />
      }
    });

    expect(entry.container.querySelector('.some-class')).toBeInTheDocument();
  });
});
