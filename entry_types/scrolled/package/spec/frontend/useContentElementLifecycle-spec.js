import {frontend, Entry, useContentElementLifecycle} from 'pageflow-scrolled/frontend';

import {StaticPreview} from 'frontend/useScrollPositionLifecycle';
import {TwoColumn} from 'frontend/layouts/TwoColumn';
import {renderInEntry} from 'support';
import {simulateScrollingIntoView, simulateScrollingOutOfView} from 'support/fakeIntersectionObserver';
import {findIsActiveProbe, findIsPreparedProbe} from 'support/scrollPositionLifecycle';
import {fakeBoundingClientRectsByTestId} from 'support/fakeBoundingClientRects';

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
    jest.spyOn(console, 'error').mockImplementation(() => {});

    renderInEntry(
      <Entry />,
      {seed: {contentElements: [{typeName: 'test'}]}}
    );

    expect(console.error).toHaveBeenCalledWith(expect.stringMatching(
      /only available in content elements for which `lifecycle: true`/
    ), expect.anything());
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

    it('is true if probe is inside viewport', async () => {
      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      act(() =>
        simulateScrollingIntoView(findIsActiveProbe(getByTestId('testElement')))
      );

      expect(getByTestId('testElement')).toHaveTextContent('playing');
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

      expect(getByTestId('testElement')).toHaveTextContent('paused');
    });

    it('stays false when parent section becomes active', async () => {
      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      act(() =>
        simulateScrollingIntoView(findIsActiveProbe(getByTestId('testElement').closest('section')))
      );

      expect(getByTestId('testElement')).toHaveTextContent('paused');
    });

    it('is true for backdrop content element when parent section becomes active', async () => {
      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          sections: [{id: 1, configuration: {backdrop: {contentElement: 10}}}],
          contentElements: [
            {permaId: 10, sectionId: 1, typeName: 'test', configuration: {position: 'backdrop'}}
          ]
        }
      });

      act(() =>
        simulateScrollingIntoView(findIsActiveProbe(getByTestId('testElement').closest('section')))
      );

      expect(getByTestId('testElement')).toHaveTextContent('playing');
    });

    it('is false for backdrop content element when section content intersects', async () => {
      TwoColumn.contentAreaProbeProps = {'data-testid': 'contentAreaProbe'};

      fakeBoundingClientRectsByTestId({
        testElement: {top: 300, height: 200, bottom: 500},
        contentAreaProbe: {top: 400}
      });

      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          sections: [{id: 1, configuration: {backdrop: {contentElement: 10}}}],
          contentElements: [
            {permaId: 10, sectionId: 1, typeName: 'test', configuration: {position: 'backdrop'}},
            {permaId: 11, sectionId: 1}
          ]
        }
      });

      act(() =>
        simulateScrollingIntoView(findIsActiveProbe(getByTestId('testElement').closest('section')))
      );

      expect(getByTestId('testElement')).toHaveTextContent('paused');
    });
  });

  describe('shouldLoad', () => {
    beforeEach(() => {
      frontend.contentElementTypes.register('test', {
        lifecycle: true,

        component: function Test() {
          const {shouldLoad} = useContentElementLifecycle();
          return (
            <div data-testid="testElement">
              {shouldLoad ? 'loaded' : 'blank'}
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

    it('is true if probe is in viewport', async () => {
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

    it('stays false when parent section becomes active', async () => {
      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      act(() =>
        simulateScrollingIntoView(findIsActiveProbe(getByTestId('testElement').closest('section')))
      );

      expect(getByTestId('testElement')).toHaveTextContent('blank');
    });

    it('is true for backdrop content element when parent section becomes active', async () => {
      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          sections: [{id: 1, configuration: {backdrop: {contentElement: 10}}}],
          contentElements: [
            {permaId: 10, sectionId: 1, typeName: 'test', configuration: {position: 'backdrop'}}
          ]
        }
      });

      act(() =>
        simulateScrollingIntoView(findIsActiveProbe(getByTestId('testElement').closest('section')))
      );

      expect(getByTestId('testElement')).toHaveTextContent('loaded');
    });

    it('is true for backdrop content element even when section content intersects', async () => {
      TwoColumn.contentAreaProbeProps = {'data-testid': 'contentAreaProbe'};

      fakeBoundingClientRectsByTestId({
        testElement: {top: 300, height: 200, bottom: 500},
        contentAreaProbe: {top: 400}
      });

      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          sections: [{id: 1, configuration: {backdrop: {contentElement: 10}}}],
          contentElements: [
            {permaId: 10, sectionId: 1, typeName: 'test', configuration: {position: 'backdrop'}},
            {permaId: 11, sectionId: 1}
          ]
        }
      });

      act(() =>
        simulateScrollingIntoView(findIsActiveProbe(getByTestId('testElement').closest('section')))
      );

      expect(getByTestId('testElement')).toHaveTextContent('loaded');
    });
  });

  describe('shouldPrepare', () => {
    beforeEach(() => {
      frontend.contentElementTypes.register('test', {
        lifecycle: true,

        component: function Test() {
          const {shouldPrepare} = useContentElementLifecycle();
          return (
            <div data-testid="testElement">
              {shouldPrepare ? 'prepared' : 'blank'}
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

    it('is true if probe is in viewport', async () => {
      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      act(() =>
        simulateScrollingIntoView(findIsPreparedProbe(getByTestId('testElement')))
      );

      expect(getByTestId('testElement')).toHaveTextContent('prepared');
    });

    it('stays false when parent section becomes active', async () => {
      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          contentElements: [{typeName: 'test'}]
        }
      });

      act(() =>
        simulateScrollingIntoView(findIsActiveProbe(getByTestId('testElement').closest('section')))
      );

      expect(getByTestId('testElement')).toHaveTextContent('blank');
    });

    it('is true for backdrop content element when parent section becomes active', async () => {
      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          sections: [{id: 1, configuration: {backdrop: {contentElement: 10}}}],
          contentElements: [
            {permaId: 10, sectionId: 1, typeName: 'test', configuration: {position: 'backdrop'}}
          ]
        }
      });

      act(() =>
        simulateScrollingIntoView(findIsActiveProbe(getByTestId('testElement').closest('section')))
      );

      expect(getByTestId('testElement')).toHaveTextContent('prepared');
    });

    it('is true for backdrop content element even when section content intersects', async () => {
      TwoColumn.contentAreaProbeProps = {'data-testid': 'contentAreaProbe'};

      fakeBoundingClientRectsByTestId({
        testElement: {top: 300, height: 200, bottom: 500},
        contentAreaProbe: {top: 400}
      });

      const {getByTestId} = renderInEntry(<Entry />, {
        seed: {
          sections: [{id: 1, configuration: {backdrop: {contentElement: 10}}}],
          contentElements: [
            {permaId: 10, sectionId: 1, typeName: 'test', configuration: {position: 'backdrop'}},
            {permaId: 11, sectionId: 1}
          ]
        }
      });

      act(() =>
        simulateScrollingIntoView(findIsActiveProbe(getByTestId('testElement').closest('section')))
      );

      expect(getByTestId('testElement')).toHaveTextContent('prepared');
    });
  });

  describe('onActivate option', () => {
    it('invoked when probe enters viewport', async () => {
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
        simulateScrollingIntoView(findIsActiveProbe(getByTestId('testElement')))
      );

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('onDeactivate option', () => {
    it('invoked when probe leaves viewport', async () => {
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

      act(() => simulateScrollingIntoView(findIsActiveProbe(getByTestId('testElement'))));
      act(() => simulateScrollingOutOfView(findIsActiveProbe(getByTestId('testElement'))));

      expect(handler).toHaveBeenCalled();
    });
  });
});
