import {useCallback, useState, useRef, useEffect} from 'react';
import debounce from 'debounce';

export function useCachedValue(value, {
  defaultValue, onReset, onDebouncedChange, delay = 2000
} = {}) {
  const [cachedValue, setCachedValue] = useState(value || defaultValue);
  const previousValue = useRef(value);

  // Adjust state during render: when the upstream value changes,
  // call `onReset` and flip `cachedValue` immediately so the first
  // committed render after the change already observes the new
  // value. React detects the in-render setState and re-runs the
  // component before commit, so no extra render lands on the
  // screen — and `onReset` side effects are visible to the same
  // render that observes the new `cachedValue`.
  if (previousValue.current !== value && value !== cachedValue) {
    onReset && onReset(value);
    setCachedValue(value);
    previousValue.current = value;
  }

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
