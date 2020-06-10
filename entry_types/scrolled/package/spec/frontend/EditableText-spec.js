import React from 'react';

import {EditableText} from 'frontend';

import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

describe('EditableText', () => {
  it('renders paragraphs', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {getByText} = render(<EditableText value={value} />);

    expect(getByText('Some text')).toBeInTheDocument()
  });

  it('renders block quote', () => {
    const value = [{
      type: 'block-quote',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {getByText} = render(<EditableText value={value} />);

    expect(getByText('Some text')).toBeInTheDocument()
  });

  it('renders headings', () => {
    const value = [{
      type: 'heading',
      children: [
        {text: 'Some Heading'}
      ]
    }];

    const {getByRole} = render(<EditableText value={value} />);

    expect(getByRole('heading')).toHaveTextContent('Some Heading')
  });

  it('renders bulleted lists', () => {
    const value = [{
      type: 'bulleted-list',
      children: [
        {
          type: 'list-item',
          children: [
            {text: 'List item'}
          ]
        }
      ]
    }];

    const {getByRole} = render(<EditableText value={value} />);

    expect(getByRole('listitem')).toHaveTextContent('List item')
  });

  it('renders numbered lists', () => {
    const value = [{
      type: 'numbered-list',
      children: [
        {
          type: 'list-item',
          children: [
            {text: 'List item'}
          ]
        }
      ]
    }];

    const {getByRole} = render(<EditableText value={value} />);

    expect(getByRole('listitem')).toHaveTextContent('List item')
  });

  it('renders links', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Find more '},
        {
          type: 'link',
          href: 'https://example.com',
          children: [
            {text: 'here'}
          ]
        },
        {text: '.'}
      ]
    }]

    const {getByRole} = render(<EditableText value={value} />);

    expect(getByRole('link')).toHaveTextContent('here')
  });

  it('renders zero width no break space in empty leafs to prevent empty paragraphs from collapsing', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: ''}
      ]
    }];

    const {container} = render(<EditableText value={value} />);

    expect(container.querySelector('p')).toHaveTextContent('\uFEFF', {normalizeWhitespace: false})
  });

  it('renders zero width no break space in blank leafs to prevent empty paragraphs from collapsing', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: '  '}
      ]
    }];

    const {container} = render(<EditableText value={value} />);

    expect(container.querySelector('p')).toHaveTextContent('\uFEFF', {normalizeWhitespace: false})
  });
});
