import {useIframeHeight} from 'contentElements/dataWrapperChart/useIframeHeight';
import {tick} from 'support';

import {renderHook, act} from '@testing-library/react-hooks';

describe('useIframeHeight', () => {
  it('sets default height', async () => {
    const {result} = renderHook(() => useIframeHeight('testUrl/id/1/'));

    await asyncHandlingOfMessage(() => {
      window.postMessage('SOME_MESSAGE', '*');
    });

    expect(result.current).toEqual('400px');
  });

  it('removes listener on cleanup', async () => {
    const {result, unmount} = renderHook(() => useIframeHeight('testUrl/id/1001/'));

    unmount();
    await asyncHandlingOfMessage(() => {
      window.postMessage({'datawrapper-height': {'1001': 350}}, '*');
    });

    expect(result.current).toEqual('400px');
  });

  it('sets height from message matching chart id', async () => {
    const {result} = renderHook(() => useIframeHeight('testUrl/id/1002/'));

    await asyncHandlingOfMessage(() => {
      window.postMessage({'datawrapper-height': {'1002': 350}}, '*');
    });

    expect(result.current).toEqual('350px');
  });

  it('ignores messages for other chart id', async () => {
    const {result} = renderHook(() => useIframeHeight('testUrl/id/1002/'));

    await asyncHandlingOfMessage(() => {
      window.postMessage({'datawrapper-height': {'999': 350}}, '*');
    });

    expect(result.current).toEqual('400px');
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
