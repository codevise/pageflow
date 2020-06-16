import {useCachedValue} from 'frontend/inlineEditing/useCachedValue';

import {renderHook, act} from '@testing-library/react-hooks';

jest.useFakeTimers();

describe('useCachedValue', () => {
  it('returns passed value initially', () => {
    const {result} = renderHook(() => useCachedValue('value'));

    const [value,] = result.current;

    expect(value).toBe('value');
  });

  it('returns setValue function that updates the value', () => {
    const {result} = renderHook(() => useCachedValue('value'));

    const [,setValue] = result.current;
    act(() => setValue('new'));
    const [value,] = result.current;

    expect(value).toBe('new');
  });

  it('updates cached value when passed value changes', () => {
    const {result, rerender} = renderHook(({value}) => useCachedValue(value), {
      initialProps: {value: 'value'}
    });

    rerender({value: 'new value'});
    const [value,] = result.current;

    expect(value).toBe('new value');
  });

  it('calls onReset when passed value changes', () => {
    const listener = jest.fn();
    const {rerender} = renderHook(
      ({value}) => useCachedValue(value, {
        onReset: listener
      }),
      {initialProps: {value: 'value'}}
    );

    rerender({value: 'new value'});

    expect(listener).toHaveBeenCalledWith('new value');
  });

  it('does not call onReset when value is set via function', () => {
    const listener = jest.fn();
    const {result} = renderHook(
      ({value}) => useCachedValue(value, {
        onReset: listener
      }),
      {initialProps: {value: 'value'}}
    );

    const [, setValue] = result.current;
    act(() => setValue('new value'));

    expect(listener).not.toHaveBeenCalled();
  });

  it('does not call onReset when passed value changes to value that has previously been set', () => {
    const listener = jest.fn();
    const {result, rerender} = renderHook(
      ({value}) => useCachedValue(value, {
        onReset: listener
      }),
      {initialProps: {value: 'value'}}
    );

    const [, setValue] = result.current;
    act(() => setValue('new value'));
    rerender({value: 'new value'});

    expect(listener).not.toHaveBeenCalled();
  });

  it('calls onDebouncedChange after value has not been set for given delay', () => {
    const listener = jest.fn();
    const {result} = renderHook(() => useCachedValue('value', {
      onDebouncedChange: listener,
      delay: 1
    }));

    const [,setValue] = result.current;
    act(() => setValue('value'));
    act(() => setValue('newer'));
    act(() => setValue('newest'));
    jest.runAllTimers();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('newest');
  });

  it('does not call onDebouncedChange if value is set to identical value', () => {
    const listener = jest.fn();
    const {result} = renderHook(() => useCachedValue('value', {
      onDebouncedChange: listener,
      delay: 1
    }));

    const [,setValue] = result.current;
    act(() => setValue('value'));
    jest.runAllTimers();

    expect(listener).not.toHaveBeenCalled();
  });

  it('debounces onDebouncedChange call even if new function is passed during rerender', () => {
    const listener = jest.fn();
    const {result} = renderHook(() => useCachedValue('value', {
      onDebouncedChange: value => { listener(value) },
      delay: 1
    }));

    let [,setValue] = result.current;
    act(() => setValue('new value'));
    [,setValue] = result.current;
    act(() => setValue('newer'));
    jest.runAllTimers();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith('newer');
  });
});
