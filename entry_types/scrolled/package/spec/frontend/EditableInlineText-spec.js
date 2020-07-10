import React from 'react';

import {EditableInlineText} from 'frontend';

import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

describe('EditableInlineText', () => {
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
});
