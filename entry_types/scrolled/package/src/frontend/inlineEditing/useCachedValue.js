import {useMemo, useCallback, useState, useRef, useEffect} from 'react';
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

  const debouncedHandler = useMemo(() => onDebouncedChange && debounce(onDebouncedChange, delay),
                                   [onDebouncedChange, delay]);

  const setValue = useCallback(value => {
    setCachedValue(previousValue => {
      if (previousValue !== value) {
        debouncedHandler && debouncedHandler(value);
      }

      return value;
    });
  }, [debouncedHandler]);

  return [cachedValue, setValue];
}
