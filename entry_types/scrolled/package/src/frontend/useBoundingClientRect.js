import {useState, useEffect, useCallback} from 'react'
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect';

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

export default function useBoundingClientRect({isActive = true, dependencies = []} = {}) {
  const [boundingClientRect, setBoundingClientRect] = useState(getBoundingClientRect(null));
  const [currentNode, setCurrentNode] = useState(null);

  const measureRef = useCallback(node => {
    setCurrentNode(node);
    setBoundingClientRect(getBoundingClientRect(node))
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (dependencies.length && currentNode) {
      setBoundingClientRect(getBoundingClientRect(currentNode));
    }
  }, dependencies);

  useEffect(function() {
    function handler() {
      setBoundingClientRect(getBoundingClientRect(currentNode))
    }

    if (!currentNode || !isActive) {
      return
    }

    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler);

    return function() {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler);
    }
  }, [currentNode, isActive]);

  return [boundingClientRect, measureRef]
}
