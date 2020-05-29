import React, {useRef} from 'react';

import {BeforeAfter} from './BeforeAfter';
import {useOnScreen} from 'pageflow-scrolled/frontend';

export function InlineBeforeAfter(props) {
  const ref = useRef();
  const onScreen = useOnScreen(ref, '-50% 0px -50% 0px');

  return (
    <div ref={ref}>
      <BeforeAfter {...props.configuration}
                   state={onScreen ? 'active' : 'inactive'}
                   contentElementId={props.contentElementId}/>
    </div>
  )
}
