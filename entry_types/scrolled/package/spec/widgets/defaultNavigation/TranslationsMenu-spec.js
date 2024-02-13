import React from 'react';
import {TranslationsMenu} from 'widgets/defaultNavigation/TranslationsMenu';

import '@testing-library/jest-dom/extend-expect';
import {renderInEntry} from 'support';

describe('TranslationsMenu', () => {
  it('marks current page in rendered list of translations', async () => {
    const {getByRole} = renderInEntry(<TranslationsMenu />, {
      seed: {
        entry: {
          id: 5,
        },
        entryTranslations: [
          {
            id: 5,
            displayLocale: 'Deutsch',
            url: '/entry-de'
          },
          {
            id: 6,
            displayLocale: 'English',
            url: '/entry-en'
          }
        ]
      }
    });

    expect(getByRole('link', {name: 'English'})).toHaveAttribute('href', '/entry-en');
    expect(getByRole('listitem', {current: 'page'})).toHaveTextContent('Deutsch');
  });

  it('includes shortend uppercased locale in button', async () => {
    const {getByRole} = renderInEntry(<TranslationsMenu />, {
      seed: {
        entry: {
          id: 5,
          locale: 'de-ch'
        },
        entryTranslations: [
          {
            id: 5,
            displayLocale: 'Deutsch',
            url: '/entry-de'
          },
          {
            id: 6,
            displayLocale: 'English',
            url: '/entry-en'
          }
        ]
      }
    });

    expect(getByRole('button')).toHaveTextContent(/^DE$/);
  });

  it('renders nothing if no translations are present', async () => {
    const {container} = renderInEntry(<TranslationsMenu />, {
      seed: {
        entry: {
          id: 5,
          locale: 'de-ch'
        },
        entryTranslations: []
      }
    });

    expect(container).toBeEmptyDOMElement();
  });
});
