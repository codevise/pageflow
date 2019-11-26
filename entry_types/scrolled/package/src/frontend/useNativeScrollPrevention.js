import {useEffect} from 'react';

export default function useNativeScrollPrevention(ref) {
  useEffect(() => {
    function preventNativeScroll(e) {
      e.preventDefault();
    }

    const current = ref.current;

    if (current) {
      current.addEventListener('touchmove', preventNativeScroll);
      current.addEventListener('mousewheel', preventNativeScroll);
    }

    return () => {
      if (current) {
        current.removeEventListener('touchmove', preventNativeScroll)
        current.removeEventListener('mousewheel', preventNativeScroll);
      }
    }
  }, [ref]);
}
