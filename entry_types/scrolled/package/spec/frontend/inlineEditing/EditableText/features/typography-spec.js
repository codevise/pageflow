import React from 'react';

import {EditableText} from 'frontend';
import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects/inlineEditing';

import '@testing-library/jest-dom/extend-expect';

describe('inline editing EditableText typography', () => {
  useInlineEditingPageObjects();

  const paragraphValue = [{
    type: 'paragraph',
    children: [{text: 'Some text'}]
  }];

  it('uses body scaleCategory by default', () => {
    const entry = renderEntry({
      contentElement: {ui: <EditableText value={paragraphValue} />}
    });

    expect(entry.container.querySelector('.typography-body')).toBeInTheDocument();
  });

  it('supports using different scaleCategory', () => {
    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={paragraphValue} scaleCategory="quoteText-lg" />
      }
    });

    expect(entry.container.querySelector('.typography-quoteText')).toBeInTheDocument();
  });

  it('supports typography variant prop', () => {
    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={paragraphValue}
                          scaleCategory="quoteText-lg"
                          typographyVariant="highlight" />
      }
    });

    expect(entry.container.querySelector('.typography-quoteText-highlight')).toBeInTheDocument();
  });

  it('supports typography size prop', () => {
    const entry = renderEntry({
      contentElement: {
        ui: <EditableText value={paragraphValue}
                          scaleCategory="question"
                          typographySize="lg" />
      }
    });

    expect(entry.container.querySelector('.typography-question-lg')).toBeInTheDocument();
  });
});
