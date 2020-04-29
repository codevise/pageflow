import React from 'react';

import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'

import {ContentElement} from 'frontend/ContentElement';

describe('ContentElement', () => {
  it('renders placeholder if content element type is unknown', () => {
    const {container} = render(<ContentElement type="fantasy" />);

    expect(container).toHaveTextContent('Element of unknown type "fantasy"');
  });
});
