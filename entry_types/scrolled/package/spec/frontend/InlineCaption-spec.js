import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {renderInEntry} from 'support';

import {InlineCaption} from 'frontend/InlineCaption';

describe('InlineCaption', () => {
  it('renders nothing by default', () => {
    const {queryByRole} =
      renderInEntry(<InlineCaption />, {
        seed: {}
      });

    expect(queryByRole('caption')).toBeNull();
  });

  it('renders text given as prop', () => {
    const {queryByRole} =
      renderInEntry(<InlineCaption text={'Some caption text'} />, {
        seed: {}
      });

    expect(queryByRole('caption')).toHaveTextContent('Some caption text');
  });
});
