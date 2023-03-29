import {useState, useEffect, useRef} from 'react';

export function useDelayedBoolean(value, {fromTrueToFalse}) {
  const [, setFlag] = useState(false);
  const timeoutRef = useRef(null);
  const ref = useRef(false);

  useEffect(() => {
    if (value) {
      ref.current = true;
    }
    else if (ref.current) {
      timeoutRef.current = setTimeout(() => {
        ref.current = false;
        setFlag(value => !value);
      }, fromTrueToFalse);

      return () => clearTimeout(timeoutRef.current);
    }
  }, [value, fromTrueToFalse]);

  return value || ref.current;
};
