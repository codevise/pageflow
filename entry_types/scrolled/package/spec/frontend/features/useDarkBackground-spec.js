import {frontend, useDarkBackground} from 'frontend';

import React from 'react';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

describe('useDarkBackground', () => {
  usePageObjects();

  beforeEach(() => {
    frontend.contentElementTypes.register('test', {
      component: function Component({configuration}) {
        const darkBackground = useDarkBackground();

        return (
          <div data-testid="test-component">
            {darkBackground ? 'on dark background' : 'on light background'}
          </div>
        )
      }
    });
  });

  it('returns true by default', () => {
    const {getByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'test'
        }]
      }
    });

    expect(getByTestId('test-component')).toHaveTextContent('on dark background');
  });

  it('returns false in inverted section', () => {
    const {getByTestId} = renderEntry({
      seed: {
        sections: [{
          id: 1,
          configuration: {invert: true}
        }],
        contentElements: [{
          sectionId: 1,
          typeName: 'test'
        }]
      }
    });

    expect(getByTestId('test-component')).toHaveTextContent('on light background');
  });

  it('returns false in section with card appearance', () => {
    const {getByTestId} = renderEntry({
      seed: {
        sections: [{
          id: 1,
          configuration: {appearance: 'cards'}
        }],
        contentElements: [{
          sectionId: 1,
          typeName: 'test'
        }]
      }
    });

    expect(getByTestId('test-component')).toHaveTextContent('on light background');
  });

  it('returns true in inverted section with card appearance', () => {
    const {getByTestId} = renderEntry({
      seed: {
        sections: [{
          id: 1,
          configuration: {appearance: 'cards', invert: true}
        }],
        contentElements: [{
          sectionId: 1,
          typeName: 'test'
        }]
      }
    });

    expect(getByTestId('test-component')).toHaveTextContent('on dark background');
  });
});
