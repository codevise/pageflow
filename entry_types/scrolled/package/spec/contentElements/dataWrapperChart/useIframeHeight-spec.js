import {useIframeHeight} from 'contentElements/dataWrapperChart/useIframeHeight';

import {renderHook} from '@testing-library/react-hooks';
import {asyncHandlingOf} from 'support/asyncHandlingOf/forHooks';

describe('useIframeHeight', () => {
  it('sets default height', async () => {
    const {result} = renderHook(() => useIframeHeight('testUrl/id/1/'));

    await asyncHandlingOf(() => {
      window.postMessage('SOME_MESSAGE', '*');
    });

    expect(result.current).toEqual('400px');
  });

  it('removes listener on cleanup', async () => {
    const {result, unmount} = renderHook(() => useIframeHeight('testUrl/id/1001/'));

    unmount();
    await asyncHandlingOf(() => {
      window.postMessage({'datawrapper-height': {'1001': 350}}, '*');
    });

    expect(result.current).toEqual('400px');
  });

  it('sets height from message matching chart id', async () => {
    const {result} = renderHook(() => useIframeHeight('testUrl/id/1002/'));

    await asyncHandlingOf(() => {
      window.postMessage({'datawrapper-height': {'1002': 350}}, '*');
    });

    expect(result.current).toEqual('350px');
  });

  it('ignores messages for other chart id', async () => {
    const {result} = renderHook(() => useIframeHeight('testUrl/id/1002/'));

    await asyncHandlingOf(() => {
      window.postMessage({'datawrapper-height': {'999': 350}}, '*');
    });

    expect(result.current).toEqual('400px');
  });

});
