import React, {useMemo} from 'react';

import {ContentElement} from '../../ContentElement';
import {useSectionLifecycle} from '../../useSectionLifecycle';

import {withInlineEditingDecorator} from '../../inlineEditing';

export const BackgroundContentElement = withInlineEditingDecorator(
  'BackgroundContentElementDecorator',
  function BackgroundContentElement({
    contentElement, isIntersecting, onMotifAreaUpdate, containerDimension
  }) {
    const sectionLifecycle = useSectionLifecycle();

    const lifecycleOverride = useMemo(() => ({
      ...sectionLifecycle,
      isActive: sectionLifecycle.isActive && !isIntersecting
    }), [sectionLifecycle, isIntersecting]);

    const sectionProps = useMemo(() => ({
      isIntersecting, containerDimension
    }), [isIntersecting, containerDimension]);

    return (
      <div ref={onMotifAreaUpdate}>
        <ContentElement id={contentElement.id}
                        permaId={contentElement.permaId}
                        type={contentElement.type}
                        position={contentElement.position}
                        width={3}
                        itemProps={contentElement.props}
                        sectionProps={sectionProps}
                        lifecycleOverride={lifecycleOverride} />
      </div>
    );
  }
);
