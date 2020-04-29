import React from 'react';

import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'

jest.mock('frontend/inlineEditing/components', () => ({
  TestDecorator({text, children}) {
    return <div>{text} Decorator<div>{children}</div></div>;
  },

  TestAlternative({text, children}) {
    return <div>{text} Alternative</div>;
  }
}));

describe('inlineEditing', () => {
  // Make sure each test imports its own instance of the
  // frontend/inlineEditing module to reset the internal
  // collection of loaded inline editing components.
  beforeEach(() => jest.resetModules());

  describe('withInlineEditingDecorator', () => {
    describe('when inline editing components are loaded', () => {
      it('wraps component with decorator receiving same props', async () => {
        const {withInlineEditingDecorator, loadInlineEditingComponents} = await import('frontend/inlineEditing');

        const TestComponent = withInlineEditingDecorator('TestDecorator', function TestComponent({text}) {
          return <div>{text} Test</div>;
        });

        await loadInlineEditingComponents();
        const {container} = render(<TestComponent text="Hello" />);

        expect(container).toHaveTextContent('Hello Decorator');
        expect(container).toHaveTextContent('Hello Test');
      })
    });

    describe('when inline editing components are not loaded', () => {
      it('only renders component', async () => {
        const {withInlineEditingDecorator} = await import('frontend/inlineEditing');

        const TestComponent = withInlineEditingDecorator('TestDecorator', function TestComponent({text}) {
          return <div>{text} Test</div>;
        });

        const {container} = render(<TestComponent text="Hello" />);

        expect(container).not.toHaveTextContent('Decorator');
        expect(container).toHaveTextContent('Hello Test');
      })
    });
  });

  describe('withInlineEditingAlternative', () => {
    describe('when inline editing components are loaded', () => {
      it('renders alternative component instead', async () => {
        const {withInlineEditingAlternative, loadInlineEditingComponents} = await import('frontend/inlineEditing');

        const TestComponent = withInlineEditingAlternative('TestAlternative', function TestComponent({text}) {
          return <div>{text} Test</div>;
        });

        await loadInlineEditingComponents();
        const {container} = render(<TestComponent text="Hello" />);

        expect(container).toHaveTextContent('Hello Alternative');
        expect(container).not.toHaveTextContent('Test');
      })
    });

    describe('when inline editing components are not loaded', () => {
      it('only renders component', async () => {
        const {withInlineEditingAlternative} = await import('frontend/inlineEditing');

        const TestComponent = withInlineEditingAlternative('TestAlternative', function TestComponent({text}) {
          return <div>{text} Test</div>;
        });

        const {container} = render(<TestComponent text="Hello" />);

        expect(container).not.toHaveTextContent('Alternative');
        expect(container).toHaveTextContent('Hello Test');
      })
    });
  });
});
