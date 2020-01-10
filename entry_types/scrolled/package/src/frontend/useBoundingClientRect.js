import {useState, useEffect, useCallback} from 'react'

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

export default function useBoundingClientRect() {
  const [boundingClientRect, setBoundingClientRect] = useState(getBoundingClientRect(null));
  const [currentNode, setCurrentNode] = useState(null);

  const measureRef = useCallback(node => {
    setCurrentNode(node);
    setBoundingClientRect(getBoundingClientRect(node))
  }, []);

  useEffect(function() {
    function handler() {
      setBoundingClientRect(getBoundingClientRect(currentNode))
    }

    if (!currentNode) {
      return
    }

    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler);

    return function() {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler);
    }
  }, [currentNode]);

  return [boundingClientRect, measureRef]
}
