import {useCallback, useEffect, useRef} from 'react';

export function useTimeoutFlag(duration) {
  const flagRef = useRef(false);
  const timeoutRef = useRef(null);

  const activate = useCallback(() => {
    flagRef.current = true;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      flagRef.current = false;
    }, duration);
  }, [duration]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return [flagRef, activate];
}
