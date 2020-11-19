import React from 'react';

import {BeforeAfter} from './BeforeAfter';
import {useContentElementLifecycle} from 'pageflow-scrolled/frontend';

export function InlineBeforeAfter(props) {
  const {isActive, shouldLoad} = useContentElementLifecycle();

  return (
    <BeforeAfter {...props.configuration}
                 load={shouldLoad}
                 isActive={isActive} />
  )
}
