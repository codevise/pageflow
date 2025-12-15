import React from 'react';

import {PaddingIndicator} from './PaddingIndicator';

export function ForegroundDecorator({section, motifAreaState, sectionPadding, children}) {
  return (
    <>
      <PaddingIndicator section={section}
                        motifAreaState={motifAreaState}
                        paddingValue={sectionPadding?.paddingTop}
                        position="top" />
      {children}
      <PaddingIndicator section={section}
                        paddingValue={sectionPadding?.paddingBottom}
                        position="bottom" />
    </>
  );
}
