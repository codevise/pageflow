import {frontend, Entry, useContentElementLifecycle} from 'pageflow-scrolled/frontend';

import {renderInEntry, ErrorCatching} from 'support';
import {simulateScrollingIntoView, simulateScrollingOutOfView} from 'support/fakeIntersectionObserver';

import React from 'react';
import {act} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

describe('useContentElementLifecycle', () => {
  afterEach(() => jest.restoreAllMocks());

  it('throws descriptive error if content element type is missing flag', () => {
    frontend.contentElementTypes.register('test', {
      component: function Test() {
        useContentElementLifecycle()
        return null;
      }
    });
    const handler = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});

    renderInEntry(
      <ErrorCatching onError={e => handler(e.message)}>
        <Entry />
      </ErrorCatching>,
      {seed: {contentElements: [{typeName: 'test'}]}}
    );

    expect(handler).toHaveBeenCalledWith(expect.stringMatching(
      /only available in content elements for which `lifecycle: true`/
    ));
  });

  describe('isActive', () => {
    beforeEach(() => {
      frontend.contentElementTypes.register('test', {
        lifecycle: true,

        component: function Test() {
          const {isActive} = useContentElementLifecycle();
          return (
            <div data-testid="testElement">
              {isActive ? 'playing' : 'paused'}
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

      expect(getByTestId('testElement')).toHaveTextContent('paused');
    });

    it('is true if element is inside viewport', async () => {
      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      act(() =>
        simulateScrollingIntoView(getByTestId('testElement'))
      );

      expect(getByTestId('testElement')).toHaveTextContent('playing');
    });
  });

  describe('isPrepared', () => {
    beforeEach(() => {
      frontend.contentElementTypes.register('test', {
        lifecycle: true,

        component: function Test() {
          const {isPrepared} = useContentElementLifecycle();
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

    it('is true if element is near viewport', async () => {
      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      act(() =>
        simulateScrollingIntoView(getByTestId('testElement'))
      );

      expect(getByTestId('testElement')).toHaveTextContent('loaded');
    });
  });

  describe('onActivate option', () => {
    it('invoked when element enters viewport', async () => {
      const handler = jest.fn();

      frontend.contentElementTypes.register('test', {
        lifecycle: true,

        component: function Test() {
          useContentElementLifecycle({
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
        simulateScrollingIntoView(getByTestId('testElement'))
      );

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('onDeactivate option', () => {
    it('invoked when element leaves viewport', async () => {
      const handler = jest.fn();

      frontend.contentElementTypes.register('test', {
        lifecycle: true,

        component: function Test() {
          useContentElementLifecycle({
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

      act(() => simulateScrollingIntoView(getByTestId('testElement')));
      act(() => simulateScrollingOutOfView(getByTestId('testElement')));

      expect(handler).toHaveBeenCalled();
    });
  });
});
