import {useState, useEffect, useRef} from 'react';

export function useDelayedBoolean(value, {fromFalseToTrue, fromTrueToFalse}) {
  const [, setFlag] = useState(false);
  const timeoutRef = useRef(null);
  const ref = useRef(value);

  useEffect(() => {
    if ((value && !fromFalseToTrue) ||
        (!value && !fromTrueToFalse)) {
      ref.current = value;
    }
    else if (ref.current !== value) {
      timeoutRef.current = setTimeout(() => {
        ref.current = value;
        setFlag(flag => !flag);
      }, ref.current ? fromTrueToFalse : fromFalseToTrue);

      return () => clearTimeout(timeoutRef.current);
    }
  }, [value, fromTrueToFalse, fromFalseToTrue]);

  return (!fromFalseToTrue && value) ||
         (ref.current && (!!fromTrueToFalse || value));
};
