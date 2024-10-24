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

  it('renders legacy plain text caption', () => {
    const {queryByRole, queryByTestId} =
      renderInEntry(<Figure caption={'Some caption text'}><div data-testid="content" /></Figure>, {
        seed: {}
      });

    expect(queryByRole('figure')).toHaveTextContent('Some caption text');
    expect(queryByTestId('content')).not.toBeNull();
  });

  it('renders formatted text caption', () => {
    const value = [{
      type: 'paragraph',
      children: [{ text: 'Some caption text' }],
    }];
    const {queryByRole, queryByTestId} =
      renderInEntry(<Figure caption={value}><div data-testid="content" /></Figure>, {
        seed: {}
      });

    expect(queryByRole('figure')).toHaveTextContent('Some caption text');
    expect(queryByTestId('content')).not.toBeNull();
  });

  it('applies variant scope', () => {
    const value = [{
      type: 'paragraph',
      children: [{ text: 'Some caption text' }],
    }];
    const {container} =
      renderInEntry(<Figure caption={value} variant="invert"><div data-testid="content" /></Figure>, {
        seed: {}
      });

    expect(container.querySelector('figcaption')).toHaveClass('scope-figureCaption-invert');
  });
});
