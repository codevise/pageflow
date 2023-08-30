import React from 'react';

import {Figure} from './Figure';
import {useContentElementConfigurationUpdate} from './useContentElementConfigurationUpdate';
import {useContentElementAttributes} from './useContentElementAttributes';
import {widths} from './layouts';

/**
 * @param {Object} props
 * @param {Object} props.configuration - Configuration of the content element.
 * @param {string} props.children - Content of box.
 */
export function ContentElementFigure({configuration, children}) {
  const updateConfiguration = useContentElementConfigurationUpdate();
  const {width} = useContentElementAttributes();

  return (
    <Figure caption={configuration.caption}
            onCaptionChange={caption => updateConfiguration({caption})}
            addCaptionButtonPosition={width === widths.full ? 'outsideIndented' : 'outside'}>
      {children}
    </Figure>
  );
}
