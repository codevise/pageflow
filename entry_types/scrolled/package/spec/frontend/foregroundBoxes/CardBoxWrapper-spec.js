import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import CardBoxWrapper from 'frontend/foregroundBoxes/CardBoxWrapper';

import cardBoxStyles from 'frontend/foregroundBoxes/CardBoxWrapper.module.css';
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

  describe('backdrop blur', () => {
    it('applies blur class when overlayBackdropBlur is set and color is translucent', () => {
      const {container} = render(
        <CardBoxWrapper cardSurfaceColor="#ff000080"
                        overlayBackdropBlur={50}>
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild).toHaveClass(cardBoxStyles.blur);
    });

    it('does not apply blur class when color is opaque', () => {
      const {container} = render(
        <CardBoxWrapper cardSurfaceColor="#ff0000"
                        overlayBackdropBlur={50}>
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild).not.toHaveClass(cardBoxStyles.blur);
    });

    it('does not apply blur when everything is default', () => {
      const {container} = render(
        <CardBoxWrapper>
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild).not.toHaveClass(cardBoxStyles.blur);
    });

    it('applies blur class by default for translucent color', () => {
      const {container} = render(
        <CardBoxWrapper cardSurfaceColor="#ff000080">
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild).toHaveClass(cardBoxStyles.blur);
    });

    it('sets backdrop blur CSS variable by default for translucent color', () => {
      const {container} = render(
        <CardBoxWrapper cardSurfaceColor="#ff000080">
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild.style.getPropertyValue('--card-backdrop-blur'))
        .toBe('blur(10px)');
    });

    it('does not apply blur class when overlayBackdropBlur is 0', () => {
      const {container} = render(
        <CardBoxWrapper cardSurfaceColor="#ff000080"
                        overlayBackdropBlur={0}>
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild).not.toHaveClass(cardBoxStyles.blur);
    });

    it('sets backdrop blur CSS variable when color is translucent', () => {
      const {container} = render(
        <CardBoxWrapper cardSurfaceColor="#ff000080"
                        overlayBackdropBlur={50}>
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild.style.getPropertyValue('--card-backdrop-blur'))
        .toBe('blur(5px)');
    });
  });

  describe('cardEnd padding', () => {
    it('does not have cardEndPadding class when lastMarginBottom is set', () => {
      const {container} = render(
        <CardBoxWrapper openStart={true} openEnd={false} lastMarginBottom="lg">
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild).toHaveClass(cardBoxStyles.cardEnd);
      expect(container.firstChild).not.toHaveClass(cardBoxStyles.cardEndPadding);
    });

    it('has cardEndPadding class when lastMarginBottom is not set', () => {
      const {container} = render(
        <CardBoxWrapper openStart={true} openEnd={false}>
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild).toHaveClass(cardBoxStyles.cardEnd);
      expect(container.firstChild).toHaveClass(cardBoxStyles.cardEndPadding);
    });
  });
});
