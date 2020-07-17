import React from 'react';

import {EditableInlineText} from 'frontend';

import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

describe('EditableInlineText', () => {
  it('renders empty string by default', () => {
    const {container} = render(<EditableInlineText />);

    expect(container.innerHTML).toEqual('')
  });

  it('renders text from value', () => {
    const value = [{
      type: 'heading',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {queryByText} = render(<EditableInlineText value={value} />);

    expect(queryByText('Some text')).toBeInTheDocument()
  });

  it('supports default value', () => {
    const {queryByText} = render(<EditableInlineText defaultValue="Some default" />);

    expect(queryByText('Some default')).toBeInTheDocument()
  });

  it('prefers value over defaultValue', () => {
    const value = [{
      type: 'heading',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {queryByText} = render(<EditableInlineText value={value} defaultValue="Some default" />);

    expect(queryByText('Some text')).toBeInTheDocument()
  });
});
