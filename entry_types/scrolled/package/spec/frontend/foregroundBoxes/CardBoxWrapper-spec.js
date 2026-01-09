import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import CardBoxWrapper from 'frontend/foregroundBoxes/CardBoxWrapper';

import boundaryMarginStyles from 'frontend/foregroundBoxes/BoxBoundaryMargin.module.css';

describe('CardBoxWrapper', () => {
  describe('at section boundaries', () => {
    it('does not have noTopMargin class when not at section start', () => {
      const {container} = render(
        <CardBoxWrapper openStart={false} openEnd={true} atSectionStart={false}>
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild).not.toHaveClass(boundaryMarginStyles.noTopMargin);
    });

    it('has noTopMargin class when at section start', () => {
      const {container} = render(
        <CardBoxWrapper openStart={false} openEnd={true} atSectionStart={true}>
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild).toHaveClass(boundaryMarginStyles.noTopMargin);
    });

    it('does not have noBottomMargin class when not at section end', () => {
      const {container} = render(
        <CardBoxWrapper openStart={true} openEnd={false} atSectionEnd={false}>
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild).not.toHaveClass(boundaryMarginStyles.noBottomMargin);
    });

    it('has noBottomMargin class when at section end', () => {
      const {container} = render(
        <CardBoxWrapper openStart={true} openEnd={false} atSectionEnd={true}>
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild).toHaveClass(boundaryMarginStyles.noBottomMargin);
    });
  });
});
