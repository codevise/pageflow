import {renderHook, act} from '@testing-library/react-hooks';
import {useDelayedBoolean} from 'frontend/useDelayedBoolean';

jest.useFakeTimers();

describe('useDelayedBoolean', () => {
  it('sets the initial value', () => {
    const {result} = renderHook(
      () => useDelayedBoolean(
        true,
        {fromTrueToFalse: 1000}
      ),
    );

    expect(result.current).toBe(true);
  });

  it('switches back to false after a delay', () => {
    const {result, rerender} = renderHook(
      ({value}) => useDelayedBoolean(
        value,
        {fromTrueToFalse: 1000}
      ),
      {initialProps: {value: true}}
    );

    rerender({value: false});
    expect(result.current).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(false);
  });

  it('switches back to true immediatly', () => {
    const {result, rerender} = renderHook(
      ({value}) => useDelayedBoolean(
        value,
        {fromTrueToFalse: 1000}
      ),
      {initialProps: {value: false}}
    );

    rerender({value: true});

    expect(result.current).toBe(true);
  });

  it('cancels the switch-back timer if value becomes true again', () => {
    const {result, rerender} = renderHook(
      ({value}) => useDelayedBoolean(
        value,
        {fromTrueToFalse: 1000}
      ),
      {initialProps: {value: true}}
    );

    rerender({value: false});
    act(() => jest.advanceTimersByTime(500));
    rerender({value: true});
    act(() => jest.advanceTimersByTime(500));

    rerender({value: false});
    expect(result.current).toBe(true);
    act(() => jest.advanceTimersByTime(500));
    expect(result.current).toBe(true);
  });
});
