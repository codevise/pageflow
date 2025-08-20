import  'widgets/excursionSheet';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import 'support/viewTimelineStub';
import 'support/animateStub';
import '@testing-library/jest-dom/extend-expect'
import {act} from '@testing-library/react';

describe('transitions', () => {
  usePageObjects();

  it('applies foreground-above and foreground-below classes when scrolling middle section into view', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [
          {
            permaId: 1,
            configuration: {
              transition: 'fade',
              fullHeight: true
            }
          },
          {
            permaId: 2,
            configuration: {
              transition: 'fade',
              fullHeight: true
            }
          },
          {
            permaId: 3,
            configuration: {
              transition: 'fade',
              fullHeight: true
            }
          }
        ]
      }
    });

    getSectionByPermaId(2).simulateScrollingIntoView();

    expect(getSectionByPermaId(1).hasFadedOutForeground()).toBe(true);
    expect(getSectionByPermaId(2).hasFadedOutForeground()).toBe(false);
    expect(getSectionByPermaId(3).hasFadedOutForeground()).toBe(true);
  });

  it('fades foreground for sections with fade transition in excursions', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        widgets: [{
          typeName: 'excursionSheet',
          role: 'excursion'
        }],
        storylines: [
          {
            id: 1,
            configuration: {main: true}
          },
          {
            id: 2
          }
        ],
        chapters: [
          {
            id: 1,
            storylineId: 2,
            configuration: {
              title: 'some-excursion',
              customTitle: 'Some title'
            }
          }
        ],
        sections: [
          {
            permaId: 1,
            chapterId: 1,
            configuration: {
              transition: 'fade',
              fullHeight: true
            }
          },
          {
            permaId: 2,
            chapterId: 1,
            configuration: {
              transition: 'fade',
              fullHeight: true
            }
          },
          {
            permaId: 3,
            chapterId: 1,
            configuration: {
              transition: 'fade',
              fullHeight: true
            }
          }
        ]
      }
    });

    act(() => changeLocationHash('#some-excursion'));
    getSectionByPermaId(2).simulateScrollingIntoView();

    expect(getSectionByPermaId(1).hasFadedOutForeground()).toBe(true);
    expect(getSectionByPermaId(2).hasFadedOutForeground()).toBe(false);
    expect(getSectionByPermaId(3).hasFadedOutForeground()).toBe(true);
  });

  function changeLocationHash(hash) {
    const oldURL = window.location.href;

    window.location.hash = hash;

    window.dispatchEvent(new HashChangeEvent('hashchange', {
      oldURL,
      newURL: window.location.href
    }));
  }
});
