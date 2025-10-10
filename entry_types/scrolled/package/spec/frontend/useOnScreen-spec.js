import React, {useRef} from 'react';

import {useOnScreen} from 'frontend/useOnScreen';

import {simulateScrollingIntoView, simulateScrollingOutOfView} from 'support/fakeIntersectionObserver';

import {act, render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

describe('useOnScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('return value', () => {
    function Component() {
      const ref = useRef();
      const onScreen = useOnScreen(ref);

      return (
        <div data-testid="component" ref={ref}>onScreen: {onScreen ? 'true' : 'false'}</div>
      );
    }

    it('returns false by default', () => {
      const {getByTestId} = render(<Component />);

      expect(getByTestId('component')).toHaveTextContent('onScreen: false')
    });

    it('returns true when element is scrolled into view', () => {
      const {container, getByTestId} = render(<Component />);

      act(() => simulateScrollingIntoView(container));

      expect(getByTestId('component')).toHaveTextContent('onScreen: true')
    });

    it('returns false when element is scrolled out of view again', () => {
      const {container, getByTestId} = render(<Component />);

      act(() => simulateScrollingIntoView(container));
      act(() => simulateScrollingOutOfView(container));

      expect(getByTestId('component')).toHaveTextContent('onScreen: false')
    });
  });

  describe('onIntersecting callback', () => {
    function Component({onIntersecting}) {
      const ref = useRef();
      useOnScreen(ref, {onIntersecting});

      return (
        <div data-testid="component" ref={ref} />
      );
    }

    it('is not invoked initially', () => {
      const listener = jest.fn();
      render(<Component onIntersecting={listener} />);

      expect(listener).not.toHaveBeenCalled()
    });

    it('is invoked when element is scrolled into view', () => {
      const listener = jest.fn();
      const {container} = render(<Component onIntersecting={listener} />);

      act(() => simulateScrollingIntoView(container));

      expect(listener).toHaveBeenCalled()
    });

    it('does not re-create intersection observer when re-rendered with new function', () => {
      jest.spyOn(global, 'IntersectionObserver');

      const {rerender} =
        render(<Component onIntersecting={() => {}} />);
      rerender(<Component onIntersecting={() => {}} />);

      expect(global.IntersectionObserver).toHaveBeenCalledTimes(1)
    });
  });

  describe('onChange callback', () => {
    function Component({onChange}) {
      const ref = useRef();
      useOnScreen(ref, {onChange});

      return (
        <div data-testid="component" ref={ref} />
      );
    }

    it('is not invoked initially', () => {
      const listener = jest.fn();
      render(<Component onChange={listener} />);

      expect(listener).not.toHaveBeenCalled()
    });

    it('is invoked with true when element is scrolled into view', () => {
      const listener = jest.fn();
      const {container} = render(<Component onChange={listener} />);

      act(() => simulateScrollingIntoView(container));

      expect(listener).toHaveBeenCalledWith(true)
    });

    it('is invoked with false when element is scrolled out of view', () => {
      const listener = jest.fn();
      const {container} = render(<Component onChange={listener} />);

      act(() => simulateScrollingIntoView(container));
      act(() => simulateScrollingOutOfView(container));

      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenNthCalledWith(1, true);
      expect(listener).toHaveBeenNthCalledWith(2, false);
    });

    it('does not re-create intersection observer when re-rendered with new function', () => {
      jest.spyOn(global, 'IntersectionObserver');

      const {rerender} =
        render(<Component onChange={() => {}} />);
      rerender(<Component onChange={() => {}} />);

      expect(global.IntersectionObserver).toHaveBeenCalledTimes(1)
    });
  });
});
