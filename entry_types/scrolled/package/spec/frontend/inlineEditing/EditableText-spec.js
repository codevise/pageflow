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

  it('renders class name', () => {
    const value = [{
      type: 'heading',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(
      <EditableText value={value} className="some-class" />, {wrapper}
    );

    expect(container.querySelector('.some-class')).toBeInTheDocument()
  });

  it('uses body scaleCategory by default', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(
      <EditableText value={value} />, {wrapper}
    );

    expect(container.querySelector('.typography-body')).toBeInTheDocument()
  });

  it('supports using different scaleCategory', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(
      <EditableText value={value} scaleCategory="quoteText-lg" />, {wrapper}
    );

    expect(container.querySelector('.typography-quoteText')).toBeInTheDocument()
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

  it('supports rendering custom placeholder class name', () => {
    const {container} = render(
      <EditableText placeholder="Some placeholder"
                    placeholderClassName="custom-placeholder" />,
      {wrapper}
    );

    expect(container.querySelector('.custom-placeholder')).toBeInTheDocument()
  });

  it('does not render custom placeholder class name when not blank', () => {
    const value = [{
      type: 'heading',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(
      <EditableText value={value}
                    placeholder="Some placeholder"
                    placeholderClassName="custom-placeholder" />,
      {wrapper}
    );

    expect(container.querySelector('.custom-placeholder')).not.toBeInTheDocument()
  });
});
