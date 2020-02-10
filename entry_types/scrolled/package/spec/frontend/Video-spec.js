import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {renderInEntry} from 'support';
import {render} from '@testing-library/react'

import {Video} from 'frontend/Video';

describe('Image', () => {
  it('renders', () => {
    const {getByRole} =
      render(<Video id="videoBoatDark" />)

    expect(getByRole('img')).toHaveAttribute('src', expect.stringContaining('mp4'));
  });
});
