import React from 'react';

import {frontend} from 'frontend';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

describe('content element width', () => {
  usePageObjects();

  beforeAll(() => {
    frontend.contentElementTypes.register('test', {
      component: function Component({contentElementWidth}) {
        return (
          <div data-testid="test-component">{contentElementWidth}</div>
        )
      }
    });
  });

  it('is passed as resolved value', () => {
    const {getByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'test',
          configuration: {
            width: 3,
            position: 'sticky'
          }
        }]
      }
    });

    expect(getByTestId('test-component')).toHaveTextContent(2);
  });

  it('does not become full in phone layout if fullWidthInPhoneLayout is not set', () => {
    window.matchMedia.mockViewportWidth(500);

    const {getByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'test',
          configuration: {
            width: 2
          }
        }]
      }
    });

    expect(getByTestId('test-component')).toHaveTextContent(2);
  });

  it('becomes full in phone layout if fullWidthInPhoneLayout is set', () => {
    window.matchMedia.mockViewportWidth(500);

    const {getByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'test',
          configuration: {
            width: 2,
            fullWidthInPhoneLayout: true
          }
        }]
      }
    });

    expect(getByTestId('test-component')).toHaveTextContent(3);
  });
});
