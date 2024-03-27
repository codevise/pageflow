import {frontend, ContentElementFigure} from 'frontend';

import React from 'react';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

describe('content element figure', () => {
  usePageObjects();

  beforeEach(() => {
    frontend.contentElementTypes.register('test', {
      component: function Component({configuration}) {
        return (
          <div data-testid="test-component">
            <ContentElementFigure configuration={configuration}>
              Some content
            </ContentElementFigure>
          </div>
        )
      }
    });
  });

  it('renders figure caption', () => {
    const {getByTestId} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'test',
          configuration: {
            caption: [
              {
                type: 'paragraph',
                children: [{text: 'A caption'}]
              }
            ]
          }
        }]
      }
    });

    expect(getByTestId('test-component')).toHaveTextContent('A caption')
  });

  it('does not render figure caption for backdrop content element', () => {
    const {getByTestId} = renderEntry({
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
          configuration: {
            position: 'backdrop',
            caption: [
              {
                type: 'paragraph',
                children: [{text: 'A caption'}]
              }
            ]
          }
        }]
      }
    });

    expect(getByTestId('test-component')).not.toHaveTextContent('A caption');
  });
});
