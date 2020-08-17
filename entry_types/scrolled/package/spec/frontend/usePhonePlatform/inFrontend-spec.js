import {usePhonePlatform} from 'frontend/usePhonePlatform';

import {browser} from 'pageflow/frontend';
import {renderHookInEntry} from 'support';

describe('usePhonePlatform', () => {
  it('returns true on phone platform', () => {
    jest.spyOn(browser, 'has').mockReturnValue(true);

    const {result} = renderHookInEntry(() => usePhonePlatform());

    expect(result.current).toEqual(true);
  });

  it('returns false on Desktop', () => {
    jest.spyOn(browser, 'has').mockReturnValue(false);

    const {result} = renderHookInEntry(() => usePhonePlatform());

    expect(result.current).toEqual(false);
  });
});
