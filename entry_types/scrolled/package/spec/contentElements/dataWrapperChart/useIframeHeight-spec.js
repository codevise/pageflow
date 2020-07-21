import {useIframeHeight} from 'contentElements/dataWrapperChart/useIframeHeight';

import {renderHook} from '@testing-library/react-hooks';
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

  it('sets the given height', async () => {
    const testURL = 'testUrl/id/1/';
    fakeParentWindow();
    const {result, rerender} = renderHook(() => useIframeHeight(testURL));
    expect(result.current).toEqual('400px');

    window.postMessage({'datawrapper-height': {id : 350}}, '*');
    await tick();
    rerender();

    expect(result.current).toEqual('350px');
  });
});