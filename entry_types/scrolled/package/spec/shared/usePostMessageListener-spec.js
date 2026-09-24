import {usePostMessageListener} from 'shared/usePostMessageListener';

import {renderHook} from '@testing-library/react-hooks';
import {fakeParentWindow, tick} from 'support';

describe('usePostMessageListener', () => {
  it('calls listener on message event', async () => {
    const listener = jest.fn();
    fakeParentWindow();
    renderHook(() => usePostMessageListener(listener));

    window.postMessage('SOME_MESSAGE', '*');
    await tick();

    expect(listener).toHaveBeenCalledWith('SOME_MESSAGE');
  });

  it('ignores message from other origin', async () => {
    const listener = jest.fn();
    fakeParentWindow();
    renderHook(() => usePostMessageListener(listener));

    window.dispatchEvent(new MessageEvent('message', {
      data: 'SOME_MESSAGE',
      origin: window.location.origin.slice(0, -1)
    }));
    await tick();

    expect(listener).not.toHaveBeenCalled();
  });

  it('removes listener on cleanup', async () => {
    const listener = jest.fn();
    fakeParentWindow();
    const {unmount} = renderHook(() => usePostMessageListener(listener));

    unmount();
    window.postMessage('SOME_MESSAGE', '*');
    await tick();

    expect(listener).not.toHaveBeenCalled();
  });
});
