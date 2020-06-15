import React from 'react';

import {api} from './api';
import {withInlineEditingDecorator} from './inlineEditing';
import {ContentElementAttributesProvider} from './useContentElementAttributes';
import {ContentElementLifecycleProvider} from './useContentElementLifecycle';
import {ContentElementMargin} from './ContentElementMargin';

import styles from './ContentElement.module.css';

export const ContentElement = withInlineEditingDecorator(
  'ContentElementDecorator',
  function ContentElement(props) {
    const Component = api.contentElementTypes.getComponent(props.type);

    if (Component) {
      return (
        <ContentElementAttributesProvider id={props.id}>
          <ContentElementLifecycleProvider type={props.type}>
            <ContentElementMargin position={props.itemProps.position}>
              <Component sectionProps={props.sectionProps}
                         configuration={props.itemProps}
                         contentElementId={props.id} />
            </ContentElementMargin>
          </ContentElementLifecycleProvider>
        </ContentElementAttributesProvider>
      );
    }
    else {
      return <div className={styles.missing}>Element of unknown type "{props.type}"</div>
    }
  }
);
