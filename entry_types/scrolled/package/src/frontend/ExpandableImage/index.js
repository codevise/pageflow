import React from 'react';

import {Viewer} from './Viewer';

export function ExpandableImage({enabled, ...props}) {
  if (!enabled) {
    return props.children;
  }

  return (
    <Viewer {...props} />
  );
}
