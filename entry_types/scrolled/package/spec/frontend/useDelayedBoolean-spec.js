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

  it('supports switching to false after a delay', () => {
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

  it('supports switching to true after a delay', () => {
    const {result, rerender} = renderHook(
      ({value}) => useDelayedBoolean(
        value,
        {fromFalseToTrue: 1000}
      ),
      {initialProps: {value: false}}
    );

    rerender({value: true});
    expect(result.current).toBe(false);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(result.current).toBe(true);
  });

  it('supports switching with different delays', () => {
    const {result, rerender} = renderHook(
      ({value}) => useDelayedBoolean(
        value,
        {fromTrueToFalse: 1000, fromFalseToTrue: 500}
      ),
      {initialProps: {value: true}}
    );

    rerender({value: false});
    expect(result.current).toBe(true);

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe(true);

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe(false);

    rerender({value: true});
    expect(result.current).toBe(false);

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe(true);
  });

  it('switches back to true immediatly if fromFalseToTrue is not given', () => {
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

  it('switches back to false immediatly if fromTrueToFalse is not given', () => {
    const {result, rerender} = renderHook(
      ({value}) => useDelayedBoolean(
        value,
        {fromFalseToTrue: 1000}
      ),
      {initialProps: {value: true}}
    );

    rerender({value: false});

    expect(result.current).toBe(false);
  });

  it('does not rerender after delay when switching to true if fromFalseToTrue is not given', () => {
    const {result, rerender} = renderHook(
      ({value}) => useDelayedBoolean(
        value,
        {fromTrueToFalse: 1000}
      ),
      {initialProps: {value: false}}
    );

    rerender({value: true});
    const renderCount = result.all.length;
    act(() => jest.advanceTimersByTime(2000));

    expect(result.all.length).toEqual(renderCount);
  });

  it('does not rerender after delay when switching to false if fromTrueToFalse is not given', () => {
    const {result, rerender} = renderHook(
      ({value}) => useDelayedBoolean(
        value,
        {fromFalseToTrue: 1000}
      ),
      {initialProps: {value: true}}
    );

    rerender({value: false});
    const renderCount = result.all.length;
    act(() => jest.advanceTimersByTime(2000));

    expect(result.all.length).toEqual(renderCount);
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

  it('cancels the switch-back timer if value becomes false again', () => {
    const {result, rerender} = renderHook(
      ({value}) => useDelayedBoolean(
        value,
        {fromFalseToTrue: 1000}
      ),
      {initialProps: {value: false}}
    );

    rerender({value: true});
    act(() => jest.advanceTimersByTime(500));
    rerender({value: false});
    act(() => jest.advanceTimersByTime(500));

    rerender({value: true});
    expect(result.current).toBe(false);
    act(() => jest.advanceTimersByTime(500));
    expect(result.current).toBe(false);
  });
});
