import React from 'react';

import {ContentElement} from '../../ContentElement';

import {withInlineEditingDecorator} from '../../inlineEditing';

export const BackgroundContentElement = withInlineEditingDecorator(
  'BackgroundContentElementDecorator',
  function BackgroundContentElement({
    contentElement, isIntersecting, onMotifAreaUpdate, containerDimension
  }) {
    return (
      <div ref={onMotifAreaUpdate}>
        <ContentElement id={contentElement.id}
                        permaId={contentElement.permaId}
                        type={contentElement.type}
                        position={contentElement.position}
                        width={3}
                        itemProps={contentElement.props}
                        sectionProps={{isIntersecting, containerDimension}} />
      </div>
    );
  }
);
