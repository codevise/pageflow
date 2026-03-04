import React from 'react';

import {PaddingIndicator} from './PaddingIndicator';

export function ForegroundDecorator({section, motifAreaState, sectionPadding, suppressedPaddings, children}) {
  return (
    <>
      <PaddingIndicator section={section}
                        motifAreaState={motifAreaState}
                        paddingValue={sectionPadding?.paddingTop}
                        suppressed={suppressedPaddings?.top}
                        position="top" />
      {children}
      <PaddingIndicator section={section}
                        paddingValue={sectionPadding?.paddingBottom}
                        suppressed={suppressedPaddings?.bottom}
                        position="bottom" />
    </>
  );
}
