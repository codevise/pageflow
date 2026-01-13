import React from 'react';
import {act} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {frontend} from 'frontend';
import {renderEntry, usePageObjects} from 'support/pageObjects';
import {changeLocationHash} from 'support/changeLocationHash';

import styles from 'frontend/Section.module.css';

describe('section first class', () => {
  usePageObjects();

  beforeEach(() => window.location.hash = '#initial');

  it('is applied to first section of main storyline', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}, {id: 2, permaId: 11}]
      }
    });

    expect(getSectionByPermaId(10).el).toHaveClass(styles.first);
  });

  it('is not applied to second section of main storyline', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 1, permaId: 10}, {id: 2, permaId: 11}]
      }
    });

    expect(getSectionByPermaId(11).el).not.toHaveClass(styles.first);
  });

  it('is not applied to first section of excursion', () => {
    frontend.widgetTypes.register('excursionOverlay', {
      component: function ({children}) {
        return <div data-testid="excursion-overlay">{children}</div>;
      }
    });

    const {getSectionByPermaId} = renderEntry({
      seed: {
        widgets: [{
          typeName: 'excursionOverlay',
          role: 'excursion'
        }],
        storylines: [
          {id: 1, configuration: {main: true}},
          {id: 2}
        ],
        chapters: [
          {id: 1, storylineId: 1},
          {id: 2, storylineId: 2, configuration: {title: 'excursion'}}
        ],
        sections: [
          {id: 1, permaId: 10, chapterId: 1},
          {id: 2, permaId: 20, chapterId: 2}
        ]
      }
    });
    act(() => changeLocationHash('#excursion'));

    expect(getSectionByPermaId(20).el).not.toHaveClass(styles.first);
  });
});
