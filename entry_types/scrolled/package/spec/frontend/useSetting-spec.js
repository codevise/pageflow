import {useSetting} from 'frontend/useSetting';

import {renderHook, act} from '@testing-library/react-hooks';

import {settings} from 'pageflow/frontend';

describe('useSetting', () => {
  it('reads value from settings object', () => {
    settings.set('some', 'value');

    const {result} = renderHook(() => useSetting('some'));
    const [value] = result.current;

    expect(value).toEqual('value');
  });

  it('subscribes to changes', () => {
    settings.set('some', 'old');

    const {result} = renderHook(() => useSetting('some'));

    act(() => settings.set('some', 'new'));
    const [value] = result.current;

    expect(value).toEqual('new');
  });

  it('unsubscribes when unmounted', () => {
    settings.set('some', 'old');

    const {unmount, result} = renderHook(() => useSetting('some'));

    unmount();
    act(() => settings.set('some', 'new'));
    const [value] = result.current;

    expect(value).toEqual('old');
  });

  it('returns writer to update setting', () => {
    settings.set('some', 'old');

    const {result} = renderHook(() => useSetting('some'));
    const [, setValue] = result.current;
    act(() => setValue('new'));
    const [value] = result.current;

    expect(settings.get('some')).toEqual('new');
    expect(value).toEqual('new');
  });
});
