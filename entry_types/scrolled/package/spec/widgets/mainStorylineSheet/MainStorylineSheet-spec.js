import React from 'react';
import {act, fireEvent} from '@testing-library/react';

import {MainStorylineSheet} from 'widgets/mainStorylineSheet/MainStorylineSheet';

import {renderInEntry} from 'pageflow-scrolled/testHelpers';
import '@testing-library/jest-dom/extend-expect';
import 'support/matchMediaStub';

import styles from 'widgets/mainStorylineSheet/MainStorylineSheet.module.css';

jest.useFakeTimers();

describe('MainStorylineSheet', () => {
  const excursion = {id: 1};

  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0
    });

    window.scrollTo = jest.fn();
    window.queueMicrotask = jest.fn(fn => fn());

    document.head.innerHTML = '<meta name="theme-color" content="#fff">';
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('when excursion becomes active', () => {
    it('sets --previous-scroll-y CSS variable to current scroll position', () => {
      window.scrollY = 500;

      const {container} = renderInEntry(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      expect(container.firstChild).toHaveStyle({'--previous-scroll-y': '500px'});
    });

    it('applies inactive class', () => {
      const {container} = renderInEntry(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      expect(container.firstChild).toHaveClass(styles.inactive);
    });

    it('applies fixedPositioningContainingBlock class', () => {
      const {container} = renderInEntry(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      expect(container.firstChild).toHaveClass(styles.fixedPositioningContainingBlock);
    });

    it('sets inert attribute', () => {
      const {container} = renderInEntry(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      expect(container.firstChild).toHaveAttribute('inert', 'true');
    });
  });

  describe('when excursion becomes inactive', () => {
    it('removes inactive class', () => {
      const {container, rerender} = renderInEntry(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      rerender(
        <MainStorylineSheet activeExcursion={null}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      expect(container.firstChild).not.toHaveClass(styles.inactive);
    });

    it('removes inert attribute', () => {
      const {container, rerender} = renderInEntry(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      rerender(
        <MainStorylineSheet activeExcursion={null}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      expect(container.firstChild).not.toHaveAttribute('inert');
    });

    it('keeps fixedPositioningContainingBlock class initially', () => {
      const {container, rerender} = renderInEntry(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      rerender(
        <MainStorylineSheet activeExcursion={null}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      expect(container.firstChild).toHaveClass(styles.fixedPositioningContainingBlock);
    });

    it('removes fixedPositioningContainingBlock class when transition ends', async () => {
      const {container, rerender} = renderInEntry(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      rerender(
        <MainStorylineSheet activeExcursion={null}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      const scaler = container.firstChild.querySelector(`.${styles.scaler}`);

      act(() => {
        const event = new Event('transitionend', {bubbles: true});
        Object.defineProperty(event, 'propertyName', {value: 'filter'});
        Object.defineProperty(event, 'target', {value: scaler});
        Object.defineProperty(event, 'currentTarget', {value: scaler});
        scaler.dispatchEvent(event);
      });

      expect(container.firstChild).not.toHaveClass(styles.fixedPositioningContainingBlock)
    });

    it('removes fixedPositioningContainingBlock class after timeout', () => {
      const {container, rerender} = renderInEntry(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      rerender(
        <MainStorylineSheet activeExcursion={null}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      act(() => {
        jest.advanceTimersByTime(400);
      });

      expect(container.firstChild).not.toHaveClass(styles.fixedPositioningContainingBlock);
    });

    it('does not remove class before timeout completes', () => {
      const {container, rerender} = renderInEntry(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      rerender(
        <MainStorylineSheet activeExcursion={null}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      act(() => {
        jest.advanceTimersByTime(300);
      });

      expect(container.firstChild).toHaveClass(styles.fixedPositioningContainingBlock);
    });

    it('ignores transition end for properties other than filter', () => {
      const {container, rerender} = renderInEntry(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      rerender(
        <MainStorylineSheet activeExcursion={null}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      const scaler = container.firstChild.querySelector(`.${styles.scaler}`);

      act(() => {
        fireEvent.transitionEnd(scaler, {propertyName: 'transform'});
      });

      expect(container.firstChild).toHaveClass(styles.fixedPositioningContainingBlock);
    });
  });

  describe('prefers-reduced-motion', () => {
    it('immediately removes fixedPositioningContainingBlock class wexcursion deactivates', () => {
      window.matchMedia.mockPrefersReducedMotion();

      const {container, rerender} = renderInEntry(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      rerender(
        <MainStorylineSheet activeExcursion={null}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      expect(container.firstChild).not.toHaveClass(styles.fixedPositioningContainingBlock);
    });
  });

  describe('timeout cleanup', () => {
    it('clears timeout when excursion reopens before timeout completes', () => {
      const {container, rerender} = renderInEntry(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      rerender(
        <MainStorylineSheet activeExcursion={null}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      rerender(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      act(() => {
        jest.advanceTimersByTime(400);
      });

      expect(container.firstChild).toHaveClass(styles.fixedPositioningContainingBlock);
    });
  });

  describe('--previous-scroll-y updates', () => {
    it('does not update when switching between excursions', () => {
      window.scrollY = 500;

      const {container, rerender} = renderInEntry(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      window.scrollY = 800;

      rerender(
        <MainStorylineSheet activeExcursion={{id: 2}}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      expect(container.firstChild).toHaveStyle({'--previous-scroll-y': '500px'});
    });
  });

  describe('scroll position management', () => {
    it('scrolls to top when excursion becomes active', () => {
      window.scrollY = 500;

      renderInEntry(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('restores scroll position when excursion becomes inactive', () => {
      window.scrollY = 500;

      const {rerender} = renderInEntry(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      window.scrollTo.mockClear();

      rerender(
        <MainStorylineSheet activeExcursion={null}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      expect(window.queueMicrotask).toHaveBeenCalled();
      expect(window.scrollTo).toHaveBeenCalledWith(0, 500);
    });

    it('does not restore scroll position when rendering without excursion initially', () => {
      renderInEntry(
        <MainStorylineSheet activeExcursion={null}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      expect(window.queueMicrotask).not.toHaveBeenCalled();
    });

    it('scrolls to top when switching to different excursion', () => {
      window.scrollY = 500;

      const {rerender} = renderInEntry(
        <MainStorylineSheet activeExcursion={excursion}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      window.scrollTo.mockClear();

      rerender(
        <MainStorylineSheet activeExcursion={{id: 2}}>
          <div>Content</div>
        </MainStorylineSheet>
      );

      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });
});
