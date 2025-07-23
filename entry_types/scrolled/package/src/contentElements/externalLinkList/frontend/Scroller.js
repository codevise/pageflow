import React, {useEffect, useRef} from 'react';
import Measure from 'react-measure';

import {ScrollButton} from 'pageflow-scrolled/frontend';

export function Scroller({enabled, measureKey, children}) {
  const ref = useRef();

  if (!enabled) {
    return children({});
  }

  return (
    <Measure scroll client innerRef={ref}>
      {({contentRect, measureRef, measure}) => {
        const canScrollLeft =
          contentRect.scroll.left > 0;

        const canScrollRight =
          contentRect.scroll.width > contentRect.client.width &&
          contentRect.scroll.left < contentRect.scroll.width - contentRect.client.width;

        function scrollBy(x) {
          const list = ref.current;
          const listRect = list.getBoundingClientRect();

          if (x > 0) {
            for (let i = 0; i < list.children.length; i++) {
              const child = list.children[i];
              const rect = child.getBoundingClientRect();

              if (Math.floor(rect.right - listRect.left) > contentRect.client.width) {
                ref.current.scrollTo(child.offsetLeft - list.firstChild.offsetLeft, 0)
                break;
              }
            }
          }
          else {
            let lastPartiallyVisibleChildRect;

            for (let i = list.children.length - 1; i >= 0; i--) {
              const child = list.children[i];
              const rect = child.getBoundingClientRect();

              if (rect.left < listRect.left) {
                lastPartiallyVisibleChildRect = rect;
                break;
              }
            }

            if (!lastPartiallyVisibleChildRect) {
              return;
            }

            for (let i = 0; i < list.children.length - 1; i++) {
              const child = list.children[i];
              const rect = child.getBoundingClientRect();

              if (Math.floor(lastPartiallyVisibleChildRect.right - rect.left) <= contentRect.client.width) {
                ref.current.scrollTo(child.offsetLeft - list.firstChild.offsetLeft, 0)
                break;
              }
            }
          }
        }

        return (
          <>
            <Watch value={measureKey} onChange={measure} />
            <ScrollButton direction="left"
                          disabled={!canScrollLeft}
                          onClick={() => scrollBy(-1)} />
            <ScrollButton direction="right"
                          disabled={!canScrollRight}
                          onClick={() => scrollBy(1)}/>
            {children({
              scrollerRef: measureRef,
              handleScroll: () => measure()
            })}
          </>
        )
      }}
    </Measure>
  );
}

function Watch({value, onChange}) {
  useEffect(
    () => onChange(),
    [value, onChange]
  );

  return null;
}
