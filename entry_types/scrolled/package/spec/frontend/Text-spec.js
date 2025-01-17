import React from 'react'

import {Text} from 'frontend/Text';

import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Text', () => {
  it('render element with scale category class', () => {
    const {container} = render(
      <Text scaleCategory="heading-lg">
        Some text
      </Text>
    );

    expect(container.textContent).toEqual('Some text');
    expect(container.firstChild).toHaveClass('typography-headingLg');
  });

  it('supports rendering typography variant class name', () => {
    const {container} = render(
      <Text scaleCategory="question" typographyVariant="highlight">
        Some text
      </Text>
    );

    expect(container.firstChild).toHaveClass('typography-question-highlight');
  });

  it('removes size suffix in typography variant class name', () => {
    const {container} = render(
      <Text scaleCategory="heading-lg" typographyVariant="highlight">
        Some text
      </Text>
    );

    expect(container.firstChild).toHaveClass('typography-heading-highlight');
  });
});
