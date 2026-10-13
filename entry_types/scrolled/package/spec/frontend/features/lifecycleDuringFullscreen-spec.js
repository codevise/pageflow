import React from 'react';
import {act} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {frontend, Entry, useContentElementLifecycle} from 'pageflow-scrolled/frontend';
import screenfull from 'screenfull';

import {renderInEntry} from 'support';
import {simulateScrollingIntoView, simulateScrollingOutOfView} from 'support/fakeIntersectionObserver';
import {findIsActiveProbe, findIsPreparedProbe} from 'support/scrollPositionLifecycle';
import {changeLocationHash} from 'support/changeLocationHash';

jest.mock('screenfull', () => require('support/fakeScreenfull').createFakeScreenfull());

describe('content element lifecycle during fullscreen', () => {
  let onDeactivate;

  beforeEach(() => {
    changeLocationHash('');
    screenfull.isFullscreen = false;
    onDeactivate = jest.fn();

    frontend.contentElementTypes.register('test', {
      lifecycle: true,

      component: function Test() {
        const {shouldLoad} = useContentElementLifecycle({onDeactivate});

        return (
          <div data-testid="testElement">
            {shouldLoad ? 'loaded' : 'blank'}
          </div>
        );
      }
    });
  });

  function renderTestElement() {
    const result = renderInEntry(<Entry />, {
      seed: {
        contentElements: [{typeName: 'test'}]
      }
    });
    const element = result.getByTestId('testElement');

    act(() => {
      simulateScrollingIntoView(findIsPreparedProbe(element));
      simulateScrollingIntoView(findIsActiveProbe(element));
    });

    return element;
  }

  it('keeps loading when leaving viewport during fullscreen', () => {
    const element = renderTestElement();

    screenfull.simulateFullscreenChange(true);
    act(() => simulateScrollingOutOfView(findIsPreparedProbe(element)));

    expect(element).toHaveTextContent('loaded');
  });

  it('does not deactivate when leaving viewport during fullscreen', () => {
    const element = renderTestElement();

    screenfull.simulateFullscreenChange(true);
    act(() => simulateScrollingOutOfView(findIsActiveProbe(element)));

    expect(onDeactivate).not.toHaveBeenCalled();
  });

  it('does not deactivate when returning to viewport after fullscreen', () => {
    const element = renderTestElement();

    screenfull.simulateFullscreenChange(true);
    act(() => simulateScrollingOutOfView(findIsActiveProbe(element)));
    screenfull.simulateFullscreenChange(false);
    act(() => simulateScrollingIntoView(findIsActiveProbe(element)));

    expect(onDeactivate).not.toHaveBeenCalled();
  });

  it('deactivates again when leaving viewport after fullscreen', () => {
    const element = renderTestElement();

    screenfull.simulateFullscreenChange(true);
    screenfull.simulateFullscreenChange(false);
    act(() => simulateScrollingOutOfView(findIsActiveProbe(element)));

    expect(onDeactivate).toHaveBeenCalled();
  });
});
