import {useSectionLifecycle} from 'frontend/useSectionLifecycle';

import {Entry, frontend} from 'pageflow-scrolled/frontend';
import {StaticPreview} from 'frontend/useScrollPositionLifecycle';
import {renderInEntry} from 'support';
import {simulateScrollingIntoView, simulateScrollingOutOfView} from 'support/fakeIntersectionObserver';
import {findIsActiveProbe, findIsPreparedProbe} from 'support/scrollPositionLifecycle';

import React from 'react';
import {act} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

describe('useSectionLifecycle', () => {
  describe('isActive', () => {
    beforeEach(() => {
      frontend.contentElementTypes.register('test', {
        component: function Test() {
          const {isActive} = useSectionLifecycle();
          return (
            <div data-testid="testElement">
              {isActive ? 'active' : 'idle'}
            </div>
          );
        }
      });
    });

    it('is false by default', async () => {
      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      expect(getByTestId('testElement')).toHaveTextContent('idle');
    });

    it('is true if probe is inside viewport', async () => {
      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      act(() =>
        simulateScrollingIntoView(findIsActiveProbe(getByTestId('testElement')))
      );

      expect(getByTestId('testElement')).toHaveTextContent('active');
    });

    it('stays false even with probe inside viewport when rendered inside StaticPreview', async () => {
      const {getByTestId} = renderInEntry(<StaticPreview><Entry /></StaticPreview>, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      act(() =>
        simulateScrollingIntoView(findIsActiveProbe(getByTestId('testElement')))
      );

      expect(getByTestId('testElement')).toHaveTextContent('idle');
    });
  });

  describe('isPrepared', () => {
    beforeEach(() => {
      frontend.contentElementTypes.register('test', {
        component: function Test() {
          const {isPrepared} = useSectionLifecycle();
          return (
            <div data-testid="testElement">
              {isPrepared ? 'loaded' : 'blank'}
            </div>
          );
        }
      });
    });

    it('is false by default', async () => {
      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      expect(getByTestId('testElement')).toHaveTextContent('blank');
    });

    it('is true if probe is inside viewport', async () => {
      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      act(() =>
        simulateScrollingIntoView(findIsPreparedProbe(getByTestId('testElement')))
      );

      expect(getByTestId('testElement')).toHaveTextContent('loaded');
    });
  });

  describe('isVisible', () => {
    beforeEach(() => {
      frontend.contentElementTypes.register('test', {
        component: function Test() {
          const {isVisible} = useSectionLifecycle();
          return (
            <div data-testid="testElement">
              {isVisible ? 'visible' : 'hidden'}
            </div>
          );
        }
      });
    });

    it('is false by default', async () => {
      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      expect(getByTestId('testElement')).toHaveTextContent('hidden');
    });

    it('is true if element is in viewport', async () => {
      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      act(() =>
        simulateScrollingIntoView(getByTestId('testElement'))
      );

      expect(getByTestId('testElement')).toHaveTextContent('visible');
    });

    it('stays false even with element inside viewport when rendered inside StaticPreview', async () => {
      const {getByTestId} = renderInEntry(<StaticPreview><Entry /></StaticPreview>, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      act(() =>
        simulateScrollingIntoView(findIsActiveProbe(getByTestId('testElement')))
      );

      expect(getByTestId('testElement')).toHaveTextContent('hidden');
    });
  });

  describe('onVisible option', () => {
    it('invoked when element enters viewport', async () => {
      const handler = jest.fn();

      frontend.contentElementTypes.register('test', {
        component: function Test() {
          useSectionLifecycle({
            onVisible: handler
          });

          return (
            <div data-testid="testElement" />
          );
        }
      });

      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      act(() =>
        simulateScrollingIntoView(getByTestId('testElement'))
      );

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('onActivate option', () => {
    it('invoked when probe enters viewport', async () => {
      const handler = jest.fn();

      frontend.contentElementTypes.register('test', {
        component: function Test() {
          useSectionLifecycle({
            onActivate: handler
          });

          return (
            <div data-testid="testElement" />
          );
        }
      });

      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      act(() =>
        simulateScrollingIntoView(findIsActiveProbe(getByTestId('testElement')))
      );

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('onDeactivate option', () => {
    it('invoked when probe leaves viewport', async () => {
      const handler = jest.fn();

      frontend.contentElementTypes.register('test', {
        component: function Test() {
          useSectionLifecycle({
            onDeactivate: handler
          });

          return (
            <div data-testid="testElement" />
          );
        }
      });

      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      act(() => simulateScrollingIntoView(findIsActiveProbe(getByTestId('testElement'))));
      act(() => simulateScrollingOutOfView(findIsActiveProbe(getByTestId('testElement'))));

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('onInvisible option', () => {
    it('invoked when element leaves viewport', async () => {
      const handler = jest.fn();

      frontend.contentElementTypes.register('test', {
        component: function Test() {
          useSectionLifecycle({
            onInvisible: handler
          });

          return (
            <div data-testid="testElement" />
          );
        }
      });

      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      act(() => simulateScrollingIntoView(getByTestId('testElement')));
      act(() => simulateScrollingOutOfView(getByTestId('testElement')));

      expect(handler).toHaveBeenCalled();
    });
  });
});
