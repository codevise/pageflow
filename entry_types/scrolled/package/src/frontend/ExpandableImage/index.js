import React, {Suspense} from 'react';

const Viewer = React.lazy(() => import('./Viewer'));

export function ExpandableImage({enabled, ...props}) {
  if (!enabled) {
    return props.children;
  }

  return (
    <Suspense fallback={<div />}>
      <Viewer {...props} />
    </Suspense>
  );
}
