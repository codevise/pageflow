import {useState, useCallback, useEffect} from 'react'

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

export default function useDimension() {
  const [componentSize, setComponentSize] = useState(getSize(null));
  const [currentNode, setCurrentNode] = useState(null);

  const measuredRef = useCallback(node => {
    setCurrentNode(node);
    setComponentSize(getSize(node))
  }, []);

  useEffect(function() {
    function handleResize() {
      setComponentSize(getSize(currentNode))
    }

    if (!currentNode) {
      return;
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return function() {
      window.removeEventListener('resize', handleResize);
    }
  }, [currentNode]);

  return [componentSize, measuredRef];
}
