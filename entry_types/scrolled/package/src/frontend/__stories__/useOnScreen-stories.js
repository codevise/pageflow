import React, {useRef} from 'react';

import {useOnScreen} from '../useOnScreen';

export default {
  title: 'Frontend/useOnScreen',
  parameters: {
    percy: {skip: true}
  }
}

function TestCase({children, rootMarginV, skipIframeFix}) {
  const rootMargin = rootMarginV && `${rootMarginV} 0px ${rootMarginV} 0px`

  const ref = useRef();
  const onScreen = useOnScreen(ref, {rootMargin, skipIframeFix});

  return (
    <div>
      <div style={{height: '110vh', background: '#888'}}>
      </div>
      {parseInt(rootMarginV, 10) > 0 &&
       <div style={{background: '#fff', height: rootMarginV && rootMarginV.replace('%', 'vh')}}>
         Margin
       </div>}
      <div ref={ref} style={{height: '100vh', background: 'red'}}>
        Observed element
      </div>

      <div style={{position: 'fixed', top: 10, left: 10}}>
        Expected behavior: {children}<br />
        onScreen: {onScreen ? 'true' : 'false'}<br />
        rootMargin: {rootMargin || '-'}
      </div>
    </div>
  );
}

function NewTabButton() {
  if (window.parent === window) {
    return null;
  }

  return (
    <button onClick={() => window.open(window.location.href, '_blank')}>Open frame in new tab</button>
  );
}

export const withoutRootMargin = () =>
  <TestCase>
    true iff red div intersects viewport
  </TestCase>;

export const withNegativeRootMargin = () =>
  <TestCase rootMarginV="-50%" >
    true iff red div intersects center of viewport.
  </TestCase>;

const positiveRootMarginDescription =
  <span>
    true iff red div intersects viewport extended by 25% vertically
    (i.e. iff white div intersects viewport). To make positive root
    margins work in iframes (e.g. Storybook/Pageflow editor), the
    root option needs to be set to the iframe document (at least in
    Edge 83, Chrome 81, Firefox 77). <br />
    <NewTabButton />
  </span>;

export const withPositiveRootMargin = () =>
  <TestCase rootMarginV="25%">
    {positiveRootMarginDescription}
  </TestCase>;

export const withPositiveRootMarginWithoutIframeFix = () =>
  <TestCase rootMarginV="25%" skipIframeFix={true}>
    {positiveRootMarginDescription}
  </TestCase>;
