import {useState, useLayoutEffect} from 'react'

function getSize(el) {
  if (!el) {
    return {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    }
  }

  return {
    left: el.offsetLeft,
    top: el.offsetTop,
    width: el.offsetWidth,
    height: el.offsetHeight
  }
}

export default function useDimension(ref) {
  var [componentSize, setComponentSize]  = useState(getSize(ref && ref.current));

  useLayoutEffect(function() {
    var node = ref.current;

    function handleResize() {
      if (node) {
        setComponentSize(getSize(node))
      }
    }

    if (!node) {
      return
    }

    setTimeout(handleResize, 0);

    window.addEventListener('resize', handleResize);

    return function() {
      window.removeEventListener('resize', handleResize);
    }
  }, [ref]);

  return componentSize
}
