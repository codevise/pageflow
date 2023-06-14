import React from 'react';

import {Figure} from './Figure';
import {useContentElementConfigurationUpdate} from './useContentElementConfigurationUpdate';

/**
 * @param {Object} props
 * @param {Object} props.configuration - Configuration of the content element.
 * @param {string} props.children - Content of box.
 */
export function ContentElementFigure({configuration, children}) {
  const updateConfiguration = useContentElementConfigurationUpdate();

  return (
    <Figure caption={configuration.caption}
            onCaptionChange={caption => updateConfiguration({caption})}
            addCaptionButtonPosition={configuration.position === 'full' ? 'outsideIndented' : 'outside'}>
      {children}
    </Figure>
  );
}
