import React from 'react';

import {frontend} from 'frontend';

import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'
import {act} from '@testing-library/react';

describe('main storyline widget', () => {
  usePageObjects();

  beforeEach(() => window.location.hash = '#initial');

  it('renders main storyline chapters without widget by default', () => {
    frontend.contentElementTypes.register('text', {
      component: function ({configuration}) {
        return (
          <div>{configuration.text}</div>
        )
      }
    });

    const {container} = renderEntry({
      seed: {
        storylines: [
          {
            id: 1,
            configuration: {main: true}
          }
        ],
        chapters: [
          {id: 1, storylineId: 1}
        ],
        sections: [
          {id: 1, chapterId: 1}
        ],
        contentElements: [
          {
            typeName: 'text',
            sectionId: 1,
            configuration: {
              text: 'Main storyline text'
            }
          }
        ]
      }
    });

    expect(container).toHaveTextContent('Main storyline text');
  });

  it('wraps main storyline in widget when configured', () => {
    frontend.widgetTypes.register('mainStorylineWrapper', {
      component: function ({storyline, children}) {
        return (
          <div data-testid="main-wrapper">
            <h2>Main Content</h2>
            {children}
          </div>
        )
      }
    });

    frontend.contentElementTypes.register('text', {
      component: function ({configuration}) {
        return (
          <div>{configuration.text}</div>
        )
      }
    });

    const {getByTestId} = renderEntry({
      seed: {
        widgets: [{
          typeName: 'mainStorylineWrapper',
          role: 'mainStoryline'
        }],
        storylines: [
          {
            id: 1,
            configuration: {main: true}
          }
        ],
        chapters: [
          {id: 1, storylineId: 1}
        ],
        sections: [
          {id: 1, chapterId: 1}
        ],
        contentElements: [
          {
            typeName: 'text',
            sectionId: 1,
            configuration: {
              text: 'Main storyline text'
            }
          }
        ]
      }
    });

    expect(getByTestId('main-wrapper')).toHaveTextContent('Main Content');
    expect(getByTestId('main-wrapper')).toHaveTextContent('Main storyline text');
  });

  it('renders main storyline chapters even when no widget configured', () => {
    frontend.contentElementTypes.register('text', {
      component: function ({configuration}) {
        return (
          <div>{configuration.text}</div>
        )
      }
    });

    const {container} = renderEntry({
      seed: {
        storylines: [
          {
            id: 1,
            configuration: {main: true}
          }
        ],
        chapters: [
          {id: 1, storylineId: 1}
        ],
        sections: [
          {id: 1, chapterId: 1}
        ],
        contentElements: [
          {
            typeName: 'text',
            sectionId: 1,
            configuration: {
              text: 'Fallback storyline text'
            }
          }
        ]
      }
    });

    expect(container).toHaveTextContent('Fallback storyline text');
  });

  it('passes activeExcursion as prop to mainStorylineWrapper when excursion is activated', () => {
    frontend.widgetTypes.register('mainStorylineWrapper', {
      component: function ({storyline, activeExcursion, children}) {
        return (
          <div data-testid="main-wrapper">
            <h2>Main Content</h2>
            {activeExcursion &&
             <div data-testid="active-excursion">
               Excursion: {activeExcursion.customTitle}
             </div>}
            {children}
          </div>
        )
      }
    });

    frontend.contentElementTypes.register('text', {
      component: function ({configuration}) {
        return (
          <div>{configuration.text}</div>
        )
      }
    });

    const {getByTestId} = renderEntry({
      seed: {
        widgets: [{
          typeName: 'mainStorylineWrapper',
          role: 'mainStoryline'
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
          {id: 1, storylineId: 1},
          {
            id: 2,
            storylineId: 2,
            configuration: {
              title: 'test-excursion',
              customTitle: 'Test Excursion'
            }
          }
        ],
        sections: [
          {id: 1, chapterId: 1},
          {id: 2, chapterId: 2}
        ],
        contentElements: [
          {
            typeName: 'text',
            sectionId: 1,
            configuration: {
              text: 'Main storyline text'
            }
          },
          {
            typeName: 'text',
            sectionId: 2,
            configuration: {
              text: 'Excursion text'
            }
          }
        ]
      }
    });

    act(() => changeLocationHash('#test-excursion'));

    expect(getByTestId('main-wrapper')).toHaveTextContent('Main Content');
    expect(getByTestId('active-excursion')).toHaveTextContent('Excursion: Test Excursion');
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
