import {useEffect} from 'react';

export default function useScrollTarget(ref, isScrollTarget) {
  useEffect(() => {
    if (ref.current && isScrollTarget) {
      window.scrollTo({
        top: ref.current.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.25,
        behavior: 'smooth'
      })
    }
  }, [ref, isScrollTarget])
}
