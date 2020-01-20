import {useEffect} from 'react';

export default function useScrollTarget(ref, isScrollTarget) {
  useEffect(() => {
    if (ref.current && isScrollTarget) {
      useScrollTarget.lastTarget = ref.current;
    }
  }, [ref, isScrollTarget]);
}
