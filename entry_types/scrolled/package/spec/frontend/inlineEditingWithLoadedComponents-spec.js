import React from 'react';

import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'
import {
  withInlineEditingDecorator,
  withInlineEditingAlternative,
  loadInlineEditingComponents
} from 'frontend/inlineEditing';
import {StaticPreview} from 'frontend/useScrollPositionLifecycle';

jest.mock('frontend/inlineEditing/components', () => ({
  TestDecorator({text, children}) {
    return <div>{text} Decorator<div>{children}</div></div>;
  },

  TestAlternative({text, children}) {
    return <div>{text} Alternative</div>;
  }
}));

describe('inlineEditing', () => {
  // see inlineEditing-spec for cases where inline editing components
  // are not loaded.

  describe('when inline editing components are loaded', () => {
    describe('withInlineEditingDecorator', () => {
      it('wraps component with decorator receiving same props', async () => {
        const TestComponent = withInlineEditingDecorator('TestDecorator', function TestComponent({text}) {
          return <div>{text} Test</div>;
        });

        await loadInlineEditingComponents();
        const {container} = render(<TestComponent text="Hello" />);

        expect(container).toHaveTextContent('Hello Decorator');
        expect(container).toHaveTextContent('Hello Test');
      });

      it('renders component without decorator in static preview', async () => {
        const TestComponent = withInlineEditingDecorator('TestDecorator', function TestComponent({text}) {
          return <div>{text} Test</div>;
        });

        await loadInlineEditingComponents();
        const {container} = render(
          <StaticPreview>
            <TestComponent text="Hello" />
          </StaticPreview>
        );

        expect(container).not.toHaveTextContent('Decorator');
        expect(container).toHaveTextContent('Hello Test');
      });
    });

    describe('withInlineEditingAlternative', () => {
      it('renders alternative component instead', async () => {
        const TestComponent = withInlineEditingAlternative('TestAlternative', function TestComponent({text}) {
          return <div>{text} Test</div>;
        });

        await loadInlineEditingComponents();
        const {container} = render(<TestComponent text="Hello" />);

        expect(container).toHaveTextContent('Hello Alternative');
        expect(container).not.toHaveTextContent('Test');
      });

      it('renders original component in static preview', async () => {
        const TestComponent = withInlineEditingAlternative('TestAlternative', function TestComponent({text}) {
          return <div>{text} Test</div>;
        });

        await loadInlineEditingComponents();
        const {container} = render(
          <StaticPreview>
            <TestComponent text="Hello" />
          </StaticPreview>
        );

        expect(container).not.toHaveTextContent('Alternative');
        expect(container).toHaveTextContent('Hello Test');
      });
    });
  });
});
