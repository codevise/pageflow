import React from 'react';

import {api} from './api';
import {withInlineEditingDecorator} from './inlineEditing';
import {ContentElementAttributesProvider} from './useContentElementAttributes';
import {ContentElementLifecycleProvider} from './useContentElementLifecycle';
import {ContentElementMargin} from './ContentElementMargin';
import {ContentElementErrorBoundary} from './ContentElementErrorBoundary';

import styles from './ContentElement.module.css';

export const ContentElement = React.memo(withInlineEditingDecorator(
  'ContentElementDecorator',
  function ContentElement(props) {
    const Component = api.contentElementTypes.getComponent(props.type);
    const {defaultMarginTop} = api.contentElementTypes.getOptions(props.type) || {};

    if (Component) {
      return (
        <ContentElementAttributesProvider id={props.id} width={props.width} position={props.position}>
          <ContentElementLifecycleProvider type={props.type}
                                           override={props.lifecycleOverride}>
            <ContentElementMargin width={props.width}
                                  first={props.first}
                                  defaultMarginTop={defaultMarginTop}
                                  top={props.itemProps.marginTop}
                                  bottom={props.itemProps.marginBottom}>
              <ContentElementErrorBoundary typeName={props.type}
                                           configuration={props.itemProps}>
                <Component sectionProps={props.sectionProps}
                           customMargin={props.customMargin}
                           configuration={props.itemProps}
                           contentElementWidth={props.width}
                           contentElementId={props.id} />
              </ContentElementErrorBoundary>
            </ContentElementMargin>
          </ContentElementLifecycleProvider>
        </ContentElementAttributesProvider>
      );
    }
    else {
      return <div className={styles.missing}>Element of unknown type "{props.type}"</div>
    }
  }
), arePropsEqual);

function arePropsEqual(prevProps, nextProps) {
  return (
    prevProps.id === nextProps.id &&
    prevProps.permaId === nextProps.permaId &&
    prevProps.type === nextProps.type &&
    prevProps.first === nextProps.first &&
    prevProps.position === nextProps.position &&
    prevProps.width === nextProps.width &&
    prevProps.itemProps === nextProps.itemProps &&
    prevProps.customMargin === nextProps.customMargin &&
    prevProps.sectionProps === nextProps.sectionProps &&
    prevProps.lifecycleOverride === nextProps.lifecycleOverride
  );
}

ContentElement.defaultProps = {
  itemProps: {}
};
