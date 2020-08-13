import React from 'react';
import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'

import {TimeDisplay} from 'frontend/PlayerControls/TimeDisplay';

describe('TimeDisplay', () => {
  it('handles NaN', () => {
    const {getByTestId} = render(<TimeDisplay currentTime={NaN} duration={NaN}/>);
    expect(getByTestId('time-display')).toHaveTextContent(`-:--/-:--`);
  });

  it('handles undefined', () => {
    const {getByTestId} = render(<TimeDisplay currentTime={undefined} duration={60}/>);
    expect(getByTestId('time-display')).toHaveTextContent(`-:--/1:00`);
  });

  it('formats props passed as seconds', () => {
    const {getByTestId} = render(<TimeDisplay currentTime={10.45} duration={60}/>);
    expect(getByTestId('time-display')).toHaveTextContent('0:10/1:00');
  });

  it('displays seconds padded', () => {
    const {getByTestId} = render(<TimeDisplay currentTime={5} duration={60}/>);
    expect(getByTestId('time-display')).toHaveTextContent('0:05/1:00');
  });

  it('displays hours unpadded', () => {
    const {getByTestId} = render(<TimeDisplay currentTime={65 * 60} duration={70 * 60}/>);
    expect(getByTestId('time-display')).toHaveTextContent('1:05:00/1:10:00');
  });
});
