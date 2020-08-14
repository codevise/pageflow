
import {PhonePlatformProvider} from 'frontend';
import {usePhonePlatform} from 'frontend/usePhonePlatform';
import {loadInlineEditingComponents} from 'frontend/inlineEditing';

import {renderHook, act} from '@testing-library/react-hooks';

import '@testing-library/jest-dom/extend-expect'
import {tick} from "support";


describe('usePhonePlatform', () => {
  beforeAll(loadInlineEditingComponents);

  it('sets value when emulation mode changes', async () => {
    const {result} = renderHook(() => usePhonePlatform(), {wrapper: PhonePlatformProvider});

    await asyncHandlingOfMessage(() => {
      window.postMessage({
        type: 'CHANGE_EMULATION_MODE',
        payload: 'phone'
      }, '*');
    });

    expect(result.current).toEqual(true);
  });
  
  async function asyncHandlingOfMessage(callback) {
    await act(async () => {
      callback();
      // Ensure React update triggered by async handling of message is
      // wrapped in act
      await tick();
    });
  }
});
