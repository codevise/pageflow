import {frontend, ContentElementBox} from 'frontend';

import React from 'react';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

describe('content element box', () => {
  usePageObjects();

  beforeEach(() => {
    frontend.contentElementTypes.register('test', {
      component: function Component() {
        return (
          <div data-testid="contentElement-test">
            <ContentElementBox>
              Some content
            </ContentElementBox>
          </div>
        )
      }
    });
  });

  it('renders box', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'test'
        }]
      }
    });

    expect(getContentElementByTestId('test').containsBox()).toEqual(true);
  });

  it('does not render box for backdrop content element', () => {
    const {getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{
          id: 1,
          configuration: {
            backdrop: {
              contentElement: 10
            }
          }
        }],
        contentElements: [{
          sectionId: 1,
          permaId: 10,
          typeName: 'test',
          configuration: {position: 'backdrop'}
        }]
      }
    });

    expect(getContentElementByTestId('test').containsBox()).toEqual(false);
  });
});
