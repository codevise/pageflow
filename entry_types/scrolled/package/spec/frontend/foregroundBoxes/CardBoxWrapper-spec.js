import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import CardBoxWrapper from 'frontend/foregroundBoxes/CardBoxWrapper';

import cardBoxStyles from 'frontend/foregroundBoxes/CardBoxWrapper.module.css';
import boundaryMarginStyles from 'frontend/foregroundBoxes/BoxBoundaryMargin.module.css';

const transitionStyles = {foregroundOpacity: 'foregroundOpacity'};

describe('CardBoxWrapper', () => {
  describe('at section boundaries', () => {
    it('does not have noTopMargin class when not at section start', () => {
      const {container} = render(
        <CardBoxWrapper transitionStyles={transitionStyles}
                        openStart={false} openEnd={true} atSectionStart={false}>
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild).not.toHaveClass(boundaryMarginStyles.noTopMargin);
    });

    it('has noTopMargin class when at section start', () => {
      const {container} = render(
        <CardBoxWrapper transitionStyles={transitionStyles}
                        openStart={false} openEnd={true} atSectionStart={true}>
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild).toHaveClass(boundaryMarginStyles.noTopMargin);
    });

    it('does not have noBottomMargin class when not at section end', () => {
      const {container} = render(
        <CardBoxWrapper transitionStyles={transitionStyles}
                        openStart={true} openEnd={false} atSectionEnd={false}>
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild).not.toHaveClass(boundaryMarginStyles.noBottomMargin);
    });

    it('has noBottomMargin class when at section end', () => {
      const {container} = render(
        <CardBoxWrapper transitionStyles={transitionStyles}
                        openStart={true} openEnd={false} atSectionEnd={true}>
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild).toHaveClass(boundaryMarginStyles.noBottomMargin);
    });
  });

  describe('background element', () => {
    it('applies foregroundOpacity class to background element', () => {
      const {container} = render(
        <CardBoxWrapper transitionStyles={transitionStyles}
                        openStart={false} openEnd={false}>
          Content
        </CardBoxWrapper>
      );

      expect(container.querySelector(`.${cardBoxStyles.cardBg}`))
        .toHaveClass('foregroundOpacity');
    });
  });

  describe('content wrapper', () => {
    it('applies foregroundOpacity class to content wrapper', () => {
      const {container} = render(
        <CardBoxWrapper transitionStyles={transitionStyles}
                        openStart={false} openEnd={false}>
          <span>Content</span>
        </CardBoxWrapper>
      );

      const contentWrapper = container.querySelector(`.foregroundOpacity:not(.${cardBoxStyles.cardBg})`);
      expect(contentWrapper).not.toBeNull();
      expect(contentWrapper).toHaveTextContent('Content');
    });
  });

  describe('outside box', () => {
    it('wraps outsideBox children in foregroundOpacity', () => {
      const {container} = render(
        <CardBoxWrapper transitionStyles={transitionStyles}
                        position="sticky">
          <span>Content</span>
        </CardBoxWrapper>
      );

      expect(container.querySelector('.foregroundOpacity'))
        .toHaveTextContent('Content');
    });
  });

  describe('overlay style', () => {
    it('applies overlay style to background element', () => {
      const {container} = render(
        <CardBoxWrapper transitionStyles={transitionStyles}
                        overlayStyle={{backgroundColor: '#ff000080', backdropFilter: 'blur(5px)'}}>
          Content
        </CardBoxWrapper>
      );

      const bg = container.querySelector(`.${cardBoxStyles.cardBg}`);
      expect(bg).toHaveStyle({backgroundColor: '#ff000080'});
      expect(bg.style.backdropFilter).toBe('blur(5px)');
    });

    it('does not set inline styles when overlayStyle is empty', () => {
      const {container} = render(
        <CardBoxWrapper transitionStyles={transitionStyles}
                        overlayStyle={{}}>
          Content
        </CardBoxWrapper>
      );

      const bg = container.querySelector(`.${cardBoxStyles.cardBg}`);
      expect(bg.style.backdropFilter).toBeFalsy();
      expect(bg.style.backgroundColor).toBeFalsy();
    });
  });

  describe('cardEnd padding', () => {
    it('does not have cardEndPadding class when lastMarginBottom is set', () => {
      const {container} = render(
        <CardBoxWrapper transitionStyles={transitionStyles}
                        openStart={true} openEnd={false} lastMarginBottom="lg">
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild).toHaveClass(cardBoxStyles.cardEnd);
      expect(container.firstChild).not.toHaveClass(cardBoxStyles.cardEndPadding);
    });

    it('has cardEndPadding class when lastMarginBottom is not set', () => {
      const {container} = render(
        <CardBoxWrapper transitionStyles={transitionStyles}
                        openStart={true} openEnd={false}>
          Content
        </CardBoxWrapper>
      );

      expect(container.firstChild).toHaveClass(cardBoxStyles.cardEnd);
      expect(container.firstChild).toHaveClass(cardBoxStyles.cardEndPadding);
    });
  });
});
