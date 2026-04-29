import {useCallback, useState, useRef, useEffect} from 'react';
import debounce from 'debounce';

export function useCachedValue(value, {
  defaultValue, onReset, onDebouncedChange, delay = 2000
} = {}) {
  const [cachedValue, setCachedValue] = useState(value || defaultValue);
  const previousValue = useRef(value);

  useEffect(() => {
    if (previousValue.current !== value && value !== cachedValue) {
      onReset && onReset(value);
      setCachedValue(value);
    }
  }, [onReset, value, cachedValue]);

  useEffect(() => {
    previousValue.current = value;
  });

  const debouncedHandler = useDebouncedCallback(onDebouncedChange, delay);

  const setValue = useCallback(value => {
    setCachedValue(previousValue => {
      if (previousValue !== value) {
        debouncedHandler(value);
      }

      return value;
    });
  }, [debouncedHandler]);

  return [cachedValue, setValue];
}

// Debounce callback even if the callback function changes across renders.
function useDebouncedCallback(callback, delay) {
  const mostRecentCallback = useRef(null);
  const debouncedHandler = useRef(null);

  useEffect(() => {
    mostRecentCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    debouncedHandler.current = debounce(value => {
      if (mostRecentCallback.current) {
        mostRecentCallback.current(value);
      }
    }, delay);

    return () => {
      debouncedHandler.current.flush();
    }
  }, [delay]);

  return useCallback((...args) => debouncedHandler.current(...args), []);
}
