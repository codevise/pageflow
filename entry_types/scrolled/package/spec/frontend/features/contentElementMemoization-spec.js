import {frontend} from 'frontend';

import React from 'react';

import {renderEntry, usePageObjects} from 'support/pageObjects';

describe('content element memoization', () => {
  usePageObjects();

  let renderSpy;

  beforeEach(() => {
    frontend.contentElementTypes.register('test', {
      component: function Component() {
        renderSpy();

        return (
          <div>
            Some content
          </div>
        )
      }
    });
  });

  it('does not rerender content element when entry rerenders', () => {
    renderSpy = jest.fn();

    const {rerender} = renderEntry({
      seed: {
        contentElements: [{
          typeName: 'test'
        }]
      }
    });

    renderSpy.mockReset();
    rerender();

    expect(renderSpy).not.toHaveBeenCalled();
  });

  it('does not rerender backdrop content element when entry rerenders', () => {
    renderSpy = jest.fn();

    const {rerender} = renderEntry({
      seed: {
        sections: [{
          id: 1,
          configuration: {
            backdrop: {contentElement: 11}
          }
        }],
        contentElements: [{
          permaId: 11,
          sectionId: 1,
          typeName: 'test',
          configuration: {
            position: 'backdrop'
          }
        }]
      }
    });

    renderSpy.mockReset();
    rerender();

    expect(renderSpy).not.toHaveBeenCalled();
  });
});
