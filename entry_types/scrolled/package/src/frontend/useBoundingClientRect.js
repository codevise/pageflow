import {useState, useLayoutEffect} from 'react'

function getBoundingClientRect(el) {
  if (!el) {
    return {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      width: 0,
      height: 0
    }
  }

  return el.getBoundingClientRect();
}

export default function useBoundingClientRect(ref, dependecy) {
  var [boundingClientRect, setBoundingClientRect] = useState(getBoundingClientRect(ref && ref.current));

  const current = ref.current;
  
  useLayoutEffect(function() {
    var node = current;

    function handler() {
      if (node) {
        setBoundingClientRect(getBoundingClientRect(node))
      }
    }

    if (!node) {
      return
    }

    setTimeout(handler, 0);

    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler);

    return function() {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler);
    }
  }, [current, dependecy]);

  return boundingClientRect
}
