import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import {
  useFloating,
  flip, autoUpdate
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

export function useAnchoredFloating(rangeKey, anchors, {
  placement = 'right-start',
  flipOnOverflow = false,
  mainAxisOffset = 8,
  fitWidth
} = {}) {
  const hasAnchor = anchors._elements.current.has(rangeKey);

  const {
    refs, floatingStyles, placement: resolvedPlacement, isPositioned, middlewareData
  } = useFloating({
    placement,
    middleware: [
      alignToContainerEdge(anchors.containerRef, {mainAxisOffset, fitWidth}),
      ...(flipOnOverflow ? [flip({crossAxis: false, padding: 8})] : []),
      clampXToViewport({viewportPadding: 8})
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

  const fits = middlewareData.alignToContainerEdge?.fits;

  return {refs, floatingStyles, placement: resolvedPlacement, isPositioned, hasAnchor, fits};
}

function alignToContainerEdge(containerRef, {
  mainAxisOffset = 0,
  viewportPadding = 8,
  fitWidth
} = {}) {
  return {
    name: 'alignToContainerEdge',
    fn({rects, placement}) {
      const containerEl = containerRef.current;

      if (!containerEl) return {};

      const containerRect = containerEl.getBoundingClientRect();

      let x;
      if (placement.startsWith('right')) {
        x = containerRect.right + mainAxisOffset;
      }
      else if (placement.startsWith('left')) {
        x = containerRect.left - rects.floating.width - mainAxisOffset;
      }
      else {
        return {};
      }

      const data = {};
      if (fitWidth !== undefined) {
        const viewportWidth = document.documentElement.clientWidth;
        const fitsRight =
          containerRect.right + mainAxisOffset + fitWidth + viewportPadding <= viewportWidth;
        const fitsLeft =
          containerRect.left - mainAxisOffset - fitWidth - viewportPadding >= 0;
        data.fits = fitsRight || fitsLeft;
      }

      return {x, data};
    }
  };
}

function clampXToViewport({viewportPadding = 8} = {}) {
  return {
    name: 'clampXToViewport',
    fn({x, rects}) {
      const viewportWidth = document.documentElement.clientWidth;
      const maxX = viewportWidth - rects.floating.width - viewportPadding;
      const minX = viewportPadding;

      return {x: Math.max(minX, Math.min(x, maxX))};
    }
  };
}
