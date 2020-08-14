
import {PhonePlatformProvider} from 'frontend';
import {usePhonePlatform} from 'frontend/usePhonePlatform';

import {browser} from 'pageflow/frontend';
import {renderHook,} from '@testing-library/react-hooks';

import '@testing-library/jest-dom/extend-expect'


describe('usePhonePlatform', () => {

  it('returns true on phone platform', () => {

    jest.spyOn(browser, 'has').mockReturnValue(true);

    const {result} = renderHook(() => usePhonePlatform(), {wrapper: PhonePlatformProvider});

    expect(result.current).toEqual(true);
  });

});
