import React from 'react';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import {usePhonePlatform} from 'frontend/usePhonePlatform';
import {browser} from 'pageflow/frontend';
import '@testing-library/jest-dom/extend-expect';

function PhonePlatformProbe() {
  return <div data-testid="probe">{usePhonePlatform() ? 'phone' : 'desktop'}</div>;
}

describe('usePhonePlatform', () => {
  usePageObjects();

  it('is true on a phone platform', () => {
    jest.spyOn(browser, 'has').mockReturnValue(true);

    const {getByTestId} = renderEntry({contentElement: {ui: <PhonePlatformProbe />}});

    expect(getByTestId('probe')).toHaveTextContent('phone');
  });

  it('is false on desktop', () => {
    jest.spyOn(browser, 'has').mockReturnValue(false);

    const {getByTestId} = renderEntry({contentElement: {ui: <PhonePlatformProbe />}});

    expect(getByTestId('probe')).toHaveTextContent('desktop');
  });
});
