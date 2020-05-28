import {usePostMessageListener} from 'frontend/usePostMessageListener';

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
