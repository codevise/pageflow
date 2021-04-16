import React, {Suspense} from 'react';

const Viewer = React.lazy(() => import('./Viewer'));

export function Panorama(props) {
  return (
    <Suspense fallback={<div />}>
      <Viewer {...props} />
    </Suspense>
  );
}
