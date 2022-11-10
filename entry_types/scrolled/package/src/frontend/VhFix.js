import React, {useEffect, useRef, useState} from 'react';
import {browser} from 'pageflow/frontend';

// InApp browsers on iOS (e.g. Twitter) report the height of the
// initial viewport as 100vh. Once the page is scrolled, browser
// toolbars are hidden, the viewport becomes larger and elements with
// height 100vh no longer cover the viewport.
//
// To detect this situation, this component compares the height of a
// 100vh div with the inner height of the window on resize. Once those
// window height exceeds probe heights the component sets the `--vh`
// custom property (which default to 1vh) to a pixel value such that
// `calc(100 * var(--vh))` equals the inner height of the window.
//
// To prevent changing element sizes once the browser toolbars are
// shown again (when the user scrolls back up), `--vh` is not updated
// when the inner height of the window decreases slightly.
//
// On orientation change, we do want to update `--vh`, though. We
// therefore do update it when the inner height of the window
// decreases by more than 30%.
export function VhFix({children}) {
  const probeRef = useRef();
  const [height, setHeight] = useState();

  useEffect(() => {
    if (!browser.has('ios platform')) {
      return;
    }

    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);

    function update() {
      setHeight(previousHeight => getHeight({
        windowHeight: window.innerHeight,
        probeHeight: probeRef.current.clientHeight,
        previousHeight
      }));
    }
  }, []);

  return (
    <div style={height && {'--vh': `${height / 100}px`}}>
      <div style={{height: '100vh', position: 'absolute'}}
           ref={probeRef} />
      {children}
    </div>
  );
}

export function getHeight({windowHeight, probeHeight, previousHeight}) {
  if (probeHeight < windowHeight || previousHeight) {
    if (!previousHeight ||
        windowHeight > previousHeight ||
        windowHeight < previousHeight * 0.7) {
      return windowHeight
    }
    else {
      return previousHeight;
    }
  }
}
