import {usePhonePlatform} from 'frontend/usePhonePlatform';
import {loadInlineEditingComponents} from 'frontend/inlineEditing';

import {renderHookInEntry} from 'support';
import {asyncHandlingOf} from 'support/asyncHandlingOf';

import '@testing-library/jest-dom/extend-expect'

describe('usePhonePlatform', () => {
  beforeAll(loadInlineEditingComponents);

  it('sets value when emulation mode is mobile', async () => {
    const {result} = renderHookInEntry(() => usePhonePlatform());

    await asyncHandlingOf(() => {
      window.postMessage({
        type: 'CHANGE_EMULATION_MODE',
        payload: 'phone'
      }, '*');
    });

    expect(result.current).toEqual(true);
  });

  it('sets value when emulation mode is desktop', async () => {
    const {result} = renderHookInEntry(() => usePhonePlatform());

    await asyncHandlingOf(() => {
      window.postMessage({
        type: 'CHANGE_EMULATION_MODE',
        payload: undefined
      }, '*');
    });

    expect(result.current).toEqual(false);
  });

});
