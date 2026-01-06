import React from 'react';

import {features} from 'pageflow/frontend';

import {PaddingIndicator} from './PaddingIndicator';

export function ForegroundDecorator({section, motifAreaState, sectionPadding, children}) {
  if (!features.isEnabled('section_paddings')) {
    return children;
  }

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
