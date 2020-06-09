import React from 'react';

import {BeforeAfter} from './BeforeAfter';
import {useContentElementLifecycle} from 'pageflow-scrolled/frontend';

export function InlineBeforeAfter(props) {
  const {isActive, isPrepared} = useContentElementLifecycle();

  return (
    <BeforeAfter {...props.configuration}
                 isPrepared={isPrepared}
                 isActive={isActive} />
  )
}
