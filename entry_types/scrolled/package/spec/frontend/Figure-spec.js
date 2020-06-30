import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {renderInEntry} from 'support';

import {Figure} from 'frontend/Figure';

describe('Figure', () => {
  it('just renders children by default', () => {
    const {queryByRole, queryByTestId} =
      renderInEntry(<Figure><div data-testid="content" /></Figure>, {
        seed: {}
      });

    expect(queryByRole('figure')).toBeNull();
    expect(queryByTestId('content')).not.toBeNull();
  });

  it('renders caption given as prop', () => {
    const {queryByRole, queryByTestId} =
      renderInEntry(<Figure caption={'Some caption text'}><div data-testid="content" /></Figure>, {
        seed: {}
      });

    expect(queryByRole('figure')).toHaveTextContent('Some caption text');
    expect(queryByTestId('content')).not.toBeNull();
  });
});
