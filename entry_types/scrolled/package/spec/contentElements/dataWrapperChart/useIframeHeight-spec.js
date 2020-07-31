import {useIframeHeight} from 'contentElements/dataWrapperChart/useIframeHeight';

import {renderHook, act} from '@testing-library/react-hooks';
import {fakeParentWindow, tick} from 'support';

describe('useIframeHeight', () => {
  it('Confirms the default height', async () => {
    const testURL = 'testUrl/id/1/';
    fakeParentWindow();

    const {result} = renderHook(() => useIframeHeight(testURL));

    window.postMessage('SOME_MESSAGE', '*');
    await tick();

    expect(result.current).toEqual('400px');
  });

  it('sets the height', async () => {
    const testURL = 'https://datawrapper.dwcdn.net/CXXQo/1/';
    fakeParentWindow();
    const {result, rerender} = renderHook(() => useIframeHeight(testURL));
    expect(result.current).toEqual('400px');
    
    window.postMessage({'datawrapper-height': {
      id : 'CXXQo/1/',
      height: 350
    }}, '*');
    await tick();
    rerender();
    
    expect(result.current).toEqual('350px');
  });

  it('removes listener on cleanup', async () => {
    const testURL = 'testUrl/id/1/';
    fakeParentWindow();
    const {unmount} = renderHook(() => useIframeHeight(testURL));
    const spy = jest.spyOn(window.document, 'removeEventListener');

    unmount();
    window.postMessage('SOME_MESSAGE', '*');
    await tick();

    expect(spy).toBeCalledWith('message', expect.any(Function));
  });
});
