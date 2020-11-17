import {useState, useEffect} from 'react';
import {useDrop} from 'react-dnd';

// Used to render drop targets between paragraphs only when a content
// element is currently being dragged over the element. `react-dnd`
// causes "Update on unmounted component warning" when dropping an
// element removes a drop target [1]. As a workaround, couple
// rendering of drop targets to asynchronously updated state. That way
// the drop target is only removed after element has been dropped.
//
// [1] https://github.com/react-dnd/react-dnd/issues/1573
export function useDropTargetsActive() {
  const [dropTargetsActive, setDropTargetsActive] = useState(false);

  const [{canDrop}, drop] = useDrop({
    accept: 'contentElement',
    collect: monitor => ({
      canDrop: monitor.canDrop() && monitor.isOver()
    })
  });

  useEffect(() => {
    if (canDrop) {
      setDropTargetsActive(true);
    }
    else {
      const timeout = setTimeout(() => {
        setDropTargetsActive(false)
      }, 10);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [canDrop]);

  return [dropTargetsActive, drop];
}
