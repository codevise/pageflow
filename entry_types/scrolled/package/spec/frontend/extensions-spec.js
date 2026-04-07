import React from 'react';

import '@testing-library/jest-dom/extend-expect'
import {render, act} from '@testing-library/react'
import {
  extensible,
  provideExtensions,
  clearExtensions,
  ExtensionsProvider
} from 'frontend/extensions';
import {StaticPreview} from 'frontend/useScrollPositionLifecycle';

describe('extensions', () => {
  afterEach(() => {
    act(() => clearExtensions());
  });

  describe('extensible with decorator', () => {
    it('wraps component with decorator receiving same props', () => {
      const TestComponent = extensible('TestComponent', function TestComponent({text}) {
        return <span>{text} Component</span>;
      });

      provideExtensions({
        decorators: {
          TestComponent({text, children}) {
            return <div>{text} Decorator{children}</div>;
          }
        }
      });

      const {container} = render(<TestComponent text="Hello" />);

      expect(container).toHaveTextContent('Hello Decorator');
      expect(container).toHaveTextContent('Hello Component');
    });

    it('renders original component when no extensions provided', () => {
      const TestComponent = extensible('TestComponent', function TestComponent() {
        return <span>Component</span>;
      });

      const {container} = render(<TestComponent />);

      expect(container).toHaveTextContent('Component');
    });

    it('renders original component in static preview', () => {
      const TestComponent = extensible('TestComponent', function TestComponent() {
        return <span>Component</span>;
      });

      provideExtensions({
        decorators: {
          TestComponent({children}) {
            return <div>Decorator{children}</div>;
          }
        }
      });

      const {container} = render(
        <StaticPreview>
          <TestComponent />
        </StaticPreview>
      );

      expect(container).toHaveTextContent('Component');
      expect(container).not.toHaveTextContent('Decorator');
    });
  });

  describe('extensible with alternative', () => {
    it('renders alternative instead of original', () => {
      const TestComponent = extensible('TestComponent', function TestComponent() {
        return <span>Original</span>;
      });

      provideExtensions({
        alternatives: {
          TestComponent() {
            return <span>Alternative</span>;
          }
        }
      });

      const {container} = render(<TestComponent />);

      expect(container).toHaveTextContent('Alternative');
      expect(container).not.toHaveTextContent('Original');
    });

    it('renders original component in static preview', () => {
      const TestComponent = extensible('TestComponent', function TestComponent() {
        return <span>Original</span>;
      });

      provideExtensions({
        alternatives: {
          TestComponent() {
            return <span>Alternative</span>;
          }
        }
      });

      const {container} = render(
        <StaticPreview>
          <TestComponent />
        </StaticPreview>
      );

      expect(container).toHaveTextContent('Original');
      expect(container).not.toHaveTextContent('Alternative');
    });
  });

  describe('provideExtensions', () => {
    it('re-renders decorator after mount', () => {
      const TestComponent = extensible('TestComponent', function TestComponent() {
        return <span>Component</span>;
      });

      const {container} = render(<ExtensionsProvider><TestComponent /></ExtensionsProvider>);
      expect(container).not.toHaveTextContent('Decorator');

      act(() => {
        provideExtensions({
          decorators: {
            TestComponent({children}) {
              return <div>Decorator{children}</div>;
            }
          }
        });
      });

      expect(container).toHaveTextContent('DecoratorComponent');
    });

    it('re-renders alternative after mount', () => {
      const TestComponent = extensible('TestComponent', function TestComponent() {
        return <span>Original</span>;
      });

      const {container} = render(<ExtensionsProvider><TestComponent /></ExtensionsProvider>);
      expect(container).toHaveTextContent('Original');

      act(() => {
        provideExtensions({
          alternatives: {
            TestComponent() {
              return <span>Alternative</span>;
            }
          }
        });
      });

      expect(container).toHaveTextContent('Alternative');
      expect(container).not.toHaveTextContent('Original');
    });


    it('replaces previous extensions', () => {
      const TestComponent = extensible('TestComponent', function TestComponent() {
        return <span>Original</span>;
      });

      provideExtensions({
        alternatives: {
          TestComponent() {
            return <span>First</span>;
          }
        }
      });

      provideExtensions({
        alternatives: {
          TestComponent() {
            return <span>Second</span>;
          }
        }
      });

      const {container} = render(<TestComponent />);

      expect(container).toHaveTextContent('Second');
      expect(container).not.toHaveTextContent('First');
    });
  });
});
