import React from 'react';

import {EditableText} from 'frontend';
import {loadInlineEditingComponents} from 'frontend/inlineEditing';

import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

describe('EditableText', () => {
  beforeAll(loadInlineEditingComponents);

  beforeAll(() => window.getSelection = function() {});

  it('renders text from value', () => {
    const value = [{
      type: 'heading',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {queryByText} = render(<EditableText value={value} />);

    expect(queryByText('Some text')).toBeInTheDocument()
  });

  it('renders placeholder if value is undefined', () => {
    const {queryByText} = render(<EditableText placeholder="Some placeholder" />);

    expect(queryByText('Some placeholder')).toBeInTheDocument()
  });

  it('renders placeholder if value is empty', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: ''}
      ]
    }];

    const {queryByText} = render(<EditableText value={value}
                                               placeholder="Some placeholder" />);

    expect(queryByText('Some placeholder')).toBeInTheDocument()
  });

  it('does not render placeholder if value is present', () => {
    const value = [{
      type: 'heading',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {queryByText} = render(<EditableText value={value}
                                               placeholder="Some placeholder" />);

    expect(queryByText('Some placeholder')).not.toBeInTheDocument()
  });
});
