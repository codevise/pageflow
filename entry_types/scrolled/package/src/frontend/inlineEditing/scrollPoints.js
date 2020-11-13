import {useRef, useCallback} from 'react';
import {usePostMessageListener} from '../usePostMessageListener';

// Scroll points are used to preserve scroll position when toggling
// the editor phone preview. Each ContentElementDecorator renders a
// `data-scrollpoint` attribute with a unique value on its wrapper
// div. Before toggling the phone preview mode, the `EntryPreviewView`
// sends a `SAVE_SCROLL_POINT` message. `getCurrentScrollPoint` looks
// through all DOM elements with `data-scrollpoint` attributes and
// stores the unique id of the element with the smallest non-negative
// y coordinate in the viewport (i.e. the first content element inside
// the viewport). `ScrollPointMessageHandler` responds with a
// `SAVED_SCROLL_POINT` message which makes `EntryPreviewView` toggle
// the preview mode. Once the preview has been resized,
// `EntryPreviewView` sends a `RESTORE_SCROLL_POINT`
// message. `restoreScrollPoint` looks up the new position of the
// element with the saved scroll point and scrolls it into view.
//
// When a content element is selected, we want to keep that element
// in the viewport instead. The `SelectionRect` therefore renders a
// `data-scrollpoint=selection` attribute. If an element with such an
// attribute is present, `getCurrentScrollPoint` prefers it over all
// other scroll points. Since text block elements render a selection
// rect around the current paragraph, scroll position is also
// preserved correctly inside long text blocks.

export function ScrollPointMessageHandler() {
  const scrollPoint = useRef();

  const receiveMessage = useCallback(data => {
    if (data.type === 'SAVE_SCROLL_POINT') {
      scrollPoint.current = getCurrentScrollPoint();
      window.parent.postMessage({type: 'SAVED_SCROLL_POINT'}, window.location.origin);
    }
    else if (data.type === 'RESTORE_SCROLL_POINT') {
      if (scrollPoint.current) {
        restoreScrollPoint(scrollPoint.current);
      }
    }
  }, []);

  usePostMessageListener(receiveMessage);

  return null;
}

function getCurrentScrollPoint() {
  let scrollPointElement =
    getSelectionScrollPointElement() ||
    getScrollPointElementWithMinimumTopPositionInViewport();

  return scrollPointElement?.getAttribute('data-scrollpoint');
}

function getSelectionScrollPointElement() {
  return document.querySelector('[data-scrollpoint=selection]');
}

function getScrollPointElementWithMinimumTopPositionInViewport() {
  let minTop = Infinity;
  let scrollPointElement;

  const scrollPoints = document.querySelectorAll('[data-scrollpoint]');

  for (let i = 0; i < scrollPoints.length; i++) {
    const rect = scrollPoints[i].getBoundingClientRect();

    if (rect.top > 0 && rect.top < minTop) {
      minTop = rect.top;
      scrollPointElement = scrollPoints[i];
    }
  }

  return scrollPointElement
}

function restoreScrollPoint(name) {
  let element = document.querySelector(`[data-scrollpoint="${name}"]`);

  if (element) {
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - 100,
      behavior: 'smooth'
    });
  }
}
