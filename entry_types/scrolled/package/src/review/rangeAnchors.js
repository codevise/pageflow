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
  mainAxisOffset = 32,
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
      clampXToViewport({viewportPadding: 0})
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

export function alignToContainerEdge(containerRef, {
  mainAxisOffset = 0,
  viewportPadding = 0,
  fitWidth
} = {}) {
  return {
    name: 'alignToContainerEdge',
    fn(state) {
      const containerEl = containerRef.current;

      if (!containerEl) return {};

      const {rects, placement} = state;
      const containerRect = containerEl.getBoundingClientRect();
      const toLocalX = viewportToLocalX(state);

      let x;
      if (placement.startsWith('right')) {
        x = toLocalX(containerRect.right + mainAxisOffset);
      }
      else if (placement.startsWith('left')) {
        x = toLocalX(containerRect.left - mainAxisOffset) - rects.floating.width;
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
    fn(state) {
      const {x, rects} = state;
      const toLocalX = viewportToLocalX(state);
      const viewportWidth = document.documentElement.clientWidth;

      const minX = toLocalX(viewportPadding);
      const maxX = toLocalX(viewportWidth - viewportPadding) - rects.floating.width;

      return {x: Math.max(minX, Math.min(x, maxX))};
    }
  };
}

// Floating UI applies `x`/`y` relative to the floating element's offsetParent
// and reports `rects.reference` in that same (unscaled) space, while
// getBoundingClientRect speaks viewport coordinates. As long as the badges
// were portaled to the document root those spaces coincided, but rendered
// inside the (relatively positioned, transform-scaled) main storyline sheet
// they no longer do. Derive the offsetParent's current scale from the
// reference and build a converter from viewport into the local space the
// middleware must return.
function viewportToLocalX({rects, elements}) {
  const referenceRect = elements.reference.getBoundingClientRect();
  const scale = rects.reference.width ?
                referenceRect.width / rects.reference.width :
                1;

  return viewportX => rects.reference.x + (viewportX - referenceRect.left) / scale;
}
