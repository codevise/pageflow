import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
  useFloating,
  offset, autoUpdate
} from '@floating-ui/react';

export function useRangeAnchors() {
  const containerRef = useRef(null);
  const elements = useRef(new Map());
  const [version, setVersion] = useState(0);

  const registerAnchor = useCallback((rangeKey, el) => {
    if (el) {
      elements.current.set(rangeKey, el);
    }
    else {
      elements.current.delete(rangeKey);
    }

    setVersion(v => v + 1);
  }, []);

  const anchors = useMemo(
    () => ({containerRef, _elements: elements, _version: version}),
    [version]
  );

  return {anchors, registerAnchor};
}

export function RangeAnchor({rangeKey, onRegister, children}) {
  const ref = useRef(null);

  useEffect(() => {
    onRegister(rangeKey, ref.current);

    return () => onRegister(rangeKey, null);
  }, [rangeKey, onRegister]);

  return <span ref={ref}>{children}</span>;
}

export function useAnchoredFloating(rangeKey, anchors) {
  const hasAnchor = anchors._elements.current.has(rangeKey);

  const {refs, floatingStyles, placement, isPositioned} = useFloating({
    placement: 'right-start',
    middleware: [
      alignToContainerEdge(anchors.containerRef),
      offset({mainAxis: 8})
    ],
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, {elementResize: false})
  });

  useEffect(() => {
    const el = anchors._elements.current.get(rangeKey);

    if (el) {
      refs.setReference(el);
    }
  }, [refs, anchors, rangeKey, anchors._version]);

  return {refs, floatingStyles, placement, isPositioned, hasAnchor};
}

function alignToContainerEdge(containerRef) {
  return {
    name: 'alignToContainerEdge',
    fn({rects, placement}) {
      const containerEl = containerRef.current;

      if (!containerEl) return {};

      const containerRect = containerEl.getBoundingClientRect();

      if (placement.startsWith('right')) {
        return {x: containerRect.right};
      }
      else if (placement.startsWith('left')) {
        return {x: containerRect.left - rects.floating.width};
      }

      return {};
    }
  };
}
