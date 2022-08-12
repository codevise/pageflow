import React from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import {EditableText} from 'frontend';
import {loadInlineEditingComponents} from 'frontend/inlineEditing';

import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

describe('EditableText', () => {
  beforeAll(loadInlineEditingComponents);

  beforeAll(() => window.getSelection = function() {});

  const wrapper = ({children}) => <DndProvider backend={HTML5Backend}>{children}</DndProvider>;

  it('renders text from value', () => {
    const value = [{
      type: 'heading',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {queryByText} = render(<EditableText value={value} />, {wrapper});

    expect(queryByText('Some text')).toBeInTheDocument()
  });

  it('renders placeholder if value is undefined', () => {
    const {queryByText} = render(<EditableText placeholder="Some placeholder" />, {wrapper});

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
                                               placeholder="Some placeholder" />,
                                 {wrapper});

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
                                               placeholder="Some placeholder" />,
                                {wrapper});

    expect(queryByText('Some placeholder')).not.toBeInTheDocument()
  });
});
