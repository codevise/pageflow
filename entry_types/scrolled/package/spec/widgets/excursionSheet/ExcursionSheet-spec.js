import React from 'react';

import {ExcursionSheet} from 'widgets/excursionSheet/ExcursionSheet';

import {renderInEntry} from 'pageflow-scrolled/testHelpers';
import {simulateIntersecting, simulateNotIntersecting} from 'support/fakeIntersectionObserver';
import '@testing-library/jest-dom/extend-expect';
import 'support/viewTimelineStub';
import 'support/animateStub';

import styles from 'widgets/excursionSheet/ExcursionSheet.module.css';

describe('ExcursionSheet', () => {
  const excursion = {
    id: 1,
    sections: [],
    returnButtonLabel: 'Return'
  };

  describe('setIsCoveringBackground', () => {
    it('is not called initially', () => {
      const setIsCoveringBackground = jest.fn();

      renderInEntry(
        <ExcursionSheet
          excursion={excursion}
          onClose={jest.fn()}
          setIsCoveringBackground={setIsCoveringBackground}>
          <div>Content</div>
        </ExcursionSheet>
      );

      expect(setIsCoveringBackground).not.toHaveBeenCalled();
    });

    it('is called with false when only top observer reports intersection', () => {
      const setIsCoveringBackground = jest.fn();

      const {container} = renderInEntry(
        <ExcursionSheet
          excursion={excursion}
          onClose={jest.fn()}
          setIsCoveringBackground={setIsCoveringBackground}>
          <div>Content</div>
        </ExcursionSheet>
      );

      const content = container.querySelector(`.${styles.content}`);
      simulateIntersecting(content, {rootMargin: '0px 0px -100% 0px'});

      expect(setIsCoveringBackground).toHaveBeenCalledWith(false);
    });

    it('is called with false when only bottom observer reports intersection', () => {
      const setIsCoveringBackground = jest.fn();

      const {container} = renderInEntry(
        <ExcursionSheet
          excursion={excursion}
          onClose={jest.fn()}
          setIsCoveringBackground={setIsCoveringBackground}>
          <div>Content</div>
        </ExcursionSheet>
      );

      const content = container.querySelector(`.${styles.content}`);
      simulateIntersecting(content, {rootMargin: '-100% 0px 0px 0px'});

      expect(setIsCoveringBackground).toHaveBeenCalledWith(false);
    });

    it('is called with true when both observers report intersection', () => {
      const setIsCoveringBackground = jest.fn();

      const {container} = renderInEntry(
        <ExcursionSheet
          excursion={excursion}
          onClose={jest.fn()}
          setIsCoveringBackground={setIsCoveringBackground}>
          <div>Content</div>
        </ExcursionSheet>
      );

      const content = container.querySelector(`.${styles.content}`);
      simulateIntersecting(content, {rootMargin: '0px 0px -100% 0px'});
      simulateIntersecting(content, {rootMargin: '-100% 0px 0px 0px'});

      expect(setIsCoveringBackground).toHaveBeenCalledWith(true);
    });

    it('is called with false when one observer reports no intersection', () => {
      const setIsCoveringBackground = jest.fn();

      const {container} = renderInEntry(
        <ExcursionSheet
          excursion={excursion}
          onClose={jest.fn()}
          setIsCoveringBackground={setIsCoveringBackground}>
          <div>Content</div>
        </ExcursionSheet>
      );

      const content = container.querySelector(`.${styles.content}`);
      simulateIntersecting(content, {rootMargin: '0px 0px -100% 0px'});
      simulateIntersecting(content, {rootMargin: '-100% 0px 0px 0px'});
      simulateNotIntersecting(content, {rootMargin: '-100% 0px 0px 0px'});

      expect(setIsCoveringBackground).toHaveBeenCalledWith(false);
    });

    it('is called with false on unmount', () => {
      const setIsCoveringBackground = jest.fn();

      const {container, unmount} = renderInEntry(
        <ExcursionSheet
          excursion={excursion}
          onClose={jest.fn()}
          setIsCoveringBackground={setIsCoveringBackground}>
          <div>Content</div>
        </ExcursionSheet>
      );

      const content = container.querySelector(`.${styles.content}`);
      simulateIntersecting(content, {rootMargin: '0px 0px -100% 0px'});
      simulateIntersecting(content, {rootMargin: '-100% 0px 0px 0px'});
      setIsCoveringBackground.mockClear();

      unmount();

      expect(setIsCoveringBackground).toHaveBeenCalledWith(false);
    });
  });
});
