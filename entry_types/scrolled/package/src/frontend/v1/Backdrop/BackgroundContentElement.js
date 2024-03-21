import React from 'react';

import {ContentElement} from '../../ContentElement';

export function BackgroundContentElement({
  contentElement, isIntersecting, onMotifAreaUpdate
}) {
  return (
    <div ref={onMotifAreaUpdate}>
      <ContentElement id={contentElement.id}
                      permaId={contentElement.permaId}
                      type={contentElement.type}
                      position={contentElement.position}
                      width={3}
                      itemProps={contentElement.props}
                      sectionProps={{isIntersecting}} />
    </div>
  );
}
