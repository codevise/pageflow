import React from 'react';

import {Layout} from 'frontend/layouts';

import {render} from '@testing-library/react';

describe('Layout', () => {
  it('renders placeholder in two column variant', () => {
    const {getByTestId} = render(
      <Layout sectionProps={{layout: 'left'}}
              items={[]}
              placeholder={<div data-testid="placeholder" />} />
    );

    expect(getByTestId('placeholder')).not.toBeNull();
  });

  it('renders placeholder in center variant', () => {
    const {getByTestId} = render(
      <Layout sectionProps={{layout: 'center'}}
              items={[]}
              placeholder={<div data-testid="placeholder" />} />
    );

    expect(getByTestId('placeholder')).not.toBeNull();
  });
});
