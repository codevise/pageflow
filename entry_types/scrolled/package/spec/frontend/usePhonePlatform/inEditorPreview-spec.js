
import {PhonePlatformProvider} from 'frontend';
import {usePhonePlatform} from 'frontend/usePhonePlatform';
import {loadInlineEditingComponents} from 'frontend/inlineEditing';

import {renderHook} from '@testing-library/react-hooks';
import {asyncHandlingOf} from 'support/asyncHandlingOf/forHooks';

import '@testing-library/jest-dom/extend-expect'


describe('usePhonePlatform', () => {
  beforeAll(loadInlineEditingComponents);

  it('sets value when emulation mode is mobile', async () => {
    const {result} = renderHook(() => usePhonePlatform(), {wrapper: PhonePlatformProvider});

    await asyncHandlingOf(() => {
      window.postMessage({
        type: 'CHANGE_EMULATION_MODE',
        payload: 'phone'
      }, '*');
    });

    expect(result.current).toEqual(true);
  });

  it('sets value when emulation mode is desktop', async () => {
    const {result} = renderHook(() => usePhonePlatform(), {wrapper: PhonePlatformProvider});

    await asyncHandlingOf(() => {
      window.postMessage({
        type: 'CHANGE_EMULATION_MODE',
        payload: undefined
      }, '*');
    });

    expect(result.current).toEqual(false);
  });

});
