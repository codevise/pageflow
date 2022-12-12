import React from 'react';

import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'
import {
  withInlineEditingDecorator,
  withInlineEditingAlternative
} from 'frontend/inlineEditing';

jest.mock('frontend/inlineEditing/components', () => ({
  TestDecorator({text, children}) {
    return <div>{text} Decorator<div>{children}</div></div>;
  },

  TestAlternative({text, children}) {
    return <div>{text} Alternative</div>;
  }
}));

describe('inlineEditing', () => {
  // see inlineEditingWithLoadedComponents-spec for cases where inline
  // editing components are loaded.

  describe('when inline editing components are not loaded', () => {
    describe('withInlineEditingDecorator', () => {
      it('only renders component', () => {
        const TestComponent = withInlineEditingDecorator('TestDecorator', function TestComponent({text}) {
          return <div>{text} Test</div>;
        });

        const {container} = render(<TestComponent text="Hello" />);

        expect(container).not.toHaveTextContent('Decorator');
        expect(container).toHaveTextContent('Hello Test');
      })
    });

    describe('withInlineEditingAlternative', () => {
      it('only renders component', () => {
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
