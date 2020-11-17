import React from 'react'
import {render} from '@testing-library/react'

import {Tooltip} from 'frontend/Tooltip';

describe('Tooltip', () => {
  it('renders trigger', () => {
    const {getByTestId} = render(
      <Tooltip>
        <button data-testid={'trigger'} >trigger</button>
      </Tooltip>
    );
    expect(getByTestId('trigger')).toBeDefined();
  });

  it('renders content', () => {
    const {getByTestId} = render(
      <Tooltip content={<div data-testid={'content'}>content</div>}>
      </Tooltip>
    );
    expect(getByTestId('content')).toBeDefined();
  });
});
