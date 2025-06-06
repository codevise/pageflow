import React, {useRef} from 'react';
import Measure from 'react-measure';

import {ScrollButton} from 'pageflow-scrolled/frontend';

export function Scroller({enabled, children}) {
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
            [...list.children].find(child => {
              const rect = child.getBoundingClientRect();
              console.log(rect.right - listRect.left, contentRect.client.width)
              if (Math.floor(rect.right - listRect.left) > contentRect.client.width) {
                ref.current.scrollTo(child.offsetLeft - list.firstChild.offsetLeft, 0)
                return true;
              }

              return false;
            });
          }
          else {
            let lastPartiallyVisibleChildRect;

            for (let i = list.children.length - 1; i >= 0; i--) {
              const child = list.children[i];
              const rect = child.getBoundingClientRect();

              if (rect.left < 0) {
                console.log('part', child)
                lastPartiallyVisibleChildRect = rect;
                break;
              }
            }


            for (let i = 0; i < list.children.length - 1; i++) {
              const child = list.children[i];
              const rect = child.getBoundingClientRect();
              console.log(lastPartiallyVisibleChildRect.right - rect.left, contentRect.client.width)
              if (Math.floor(lastPartiallyVisibleChildRect.right - rect.left) <= contentRect.client.width) {
                console.log('scroll', child)
                ref.current.scrollTo(child.offsetLeft - list.firstChild.offsetLeft, 0)
                break;
              }
            }
          }
        }

        return (
          <>
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
