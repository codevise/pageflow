import {useBrowserFeature, BrowserFeaturesProvider} from 'frontend/useBrowserFeature';

import {renderHook} from '@testing-library/react-hooks';

import {browser} from 'pageflow/frontend';

describe('useBrowserFeature', () => {
  it('returns true if feature is enabled', async () => {
    jest.spyOn(browser, 'has').mockReturnValue(true)

    const {result} = renderHook(() => useBrowserFeature('some'),
                                {wrapper: BrowserFeaturesProvider});
    const value = result.current;

    expect(value).toEqual(true);
  });

  it('returns false if feature is disabled', async () => {
    jest.spyOn(browser, 'has').mockReturnValue(false)

    const {result} = renderHook(() => useBrowserFeature('some'),
                                {wrapper: BrowserFeaturesProvider});
    const value = result.current;

    expect(value).toEqual(false);
  });
});
