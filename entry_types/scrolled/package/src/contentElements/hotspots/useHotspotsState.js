import {useState, useCallback} from 'react';

import {
  useContentElementEditorState
} from 'pageflow-scrolled/frontend';

export function useHotspotsState({areas, initialActiveArea}) {
  const {setTransientState, select, isSelected} = useContentElementEditorState();

  const [activeIndex, setActiveIndexState] = useState(
    typeof initialActiveArea === 'undefined' ? -1 : initialActiveArea
  );

  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const setActiveIndex = useCallback(index => {
    setTransientState({activeAreaId: areas[index]?.id});

    setActiveIndexState(activeIndex => {
      if (activeIndex !== index && index >= 0 && isSelected) {
        select();
      }
      return index;
    });
  }, [setActiveIndexState, setTransientState, areas, select, isSelected]);

  return {
    activeIndex,
    hoveredIndex,
    highlightedIndex,
    setActiveIndex,
    setHoveredIndex,
    setHighlightedIndex
  }
}
