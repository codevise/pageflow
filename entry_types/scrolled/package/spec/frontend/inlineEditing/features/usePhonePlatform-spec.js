import React from 'react';

import {useInlineEditingPageObjects, renderEntry} from 'support/pageObjects/inlineEditing';
import {asyncHandlingOf} from 'support/asyncHandlingOf';
import {usePhonePlatform} from 'frontend/usePhonePlatform';
import '@testing-library/jest-dom/extend-expect';

function PhonePlatformProbe() {
  return <div data-testid="probe">{usePhonePlatform() ? 'phone' : 'desktop'}</div>;
}

describe('inline editing usePhonePlatform', () => {
  useInlineEditingPageObjects();

  it('reflects the editor phone emulation mode', async () => {
    const {getByTestId} = renderEntry({contentElement: {ui: <PhonePlatformProbe />}});

    expect(getByTestId('probe')).toHaveTextContent('desktop');

    await asyncHandlingOf(() => {
      window.postMessage({type: 'CHANGE_EMULATION_MODE', payload: 'phone'}, '*');
    });

    expect(getByTestId('probe')).toHaveTextContent('phone');
  });

  it('switches back when emulation mode is reset', async () => {
    const {getByTestId} = renderEntry({contentElement: {ui: <PhonePlatformProbe />}});

    await asyncHandlingOf(() => {
      window.postMessage({type: 'CHANGE_EMULATION_MODE', payload: 'phone'}, '*');
    });

    expect(getByTestId('probe')).toHaveTextContent('phone');

    await asyncHandlingOf(() => {
      window.postMessage({type: 'CHANGE_EMULATION_MODE', payload: undefined}, '*');
    });

    expect(getByTestId('probe')).toHaveTextContent('desktop');
  });
});
