import React from 'react';

import {BeforeAfter} from './BeforeAfter';
import {useContentElementLifecycle} from 'pageflow-scrolled/frontend';

export function InlineBeforeAfter(props) {
  const {isActive} = useContentElementLifecycle();

  return (
    <BeforeAfter {...props.configuration}
                 state={isActive ? 'active' : 'inactive'} />
  )
}
