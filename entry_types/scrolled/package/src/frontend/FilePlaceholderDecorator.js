import React from 'react';
import {Placeholder} from './Placeholder';

export function FilePlaceholder({file}) {
  if (file?.isReady) {
    return null;
  }

  return <Placeholder />;
}
