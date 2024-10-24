import React, {useEffect} from 'react';

import {Figure} from './Figure';
import {useContentElementConfigurationUpdate} from './useContentElementConfigurationUpdate';
import {useContentElementAttributes} from './useContentElementAttributes';
import {useContentElementEditorState} from './useContentElementEditorState';
import {widths} from './layouts';

/**
 * @param {Object} props
 * @param {Object} props.configuration - Configuration of the content element.
 * @param {string} props.children - Content of box.
 */
export function ContentElementFigure({configuration, children}) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {width, position} = useContentElementAttributes();
  const {isEditable} = useContentElementEditorState();

  if (position === 'backdrop') {
    return children;
  }

  return (
    <Figure caption={configuration.caption}
            variant={configuration.captionVariant}
            renderInsideCaption={() => isEditable && <HasCaptionTransientState />}
            onCaptionChange={caption => updateConfiguration({caption})}
            addCaptionButtonPosition={width === widths.full ? 'outsideIndented' : 'outside'}>
      {children}
    </Figure>
  );
}

function HasCaptionTransientState() {
  const {setTransientState} = useContentElementEditorState();

  useEffect(() => {
    setTransientState({hasCaption: true});
    return () => setTransientState({hasCaption: false});
  }, [setTransientState]);

  return null;
}
