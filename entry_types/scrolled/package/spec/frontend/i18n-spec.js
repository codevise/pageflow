import I18n from 'i18n-js';

import {useI18n, useLocale} from 'frontend/i18n';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderHookInEntry} from 'support';

describe('useLocale', () => {
  const originalLocale = I18n.locale;

  afterEach(() => {
    I18n.locale = originalLocale;
  });

  it('returns entry locale by default', () => {
    const {result} = renderHookInEntry(
      () => useLocale(),
      {
        seed: {
          entry: {
            locale: 'de'
          }
        }
      }
    );

    expect(result.current).toEqual('de');
  });

  it('returns locale of user interface if requested', () => {
    I18n.locale = 'fr';

    const {result} = renderHookInEntry(
      () => useLocale({locale: 'ui'}),
      {
        seed: {
          entry: {
            locale: 'de'
          }
        }
      }
    );

    expect(result.current).toEqual('fr');
  });

  it('returns entry locale if requested explicitly', () => {
    I18n.locale = 'fr';

    const {result} = renderHookInEntry(
      () => useLocale({locale: 'entry'}),
      {
        seed: {
          entry: {
            locale: 'de'
          }
        }
      }
    );

    expect(result.current).toEqual('de');
  });

  it('fails for unknown locale option', () => {
    const {result} = renderHookInEntry(
      () => useLocale({locale: 'en'}),
      {
        seed: {
          entry: {
            locale: 'de'
          }
        }
      }
    );

    expect(result.error.message).toMatch(/Unknown locale option 'en'/);
  });
});

describe('useI18n', () => {
  useFakeTranslations({
    'de.some.key': 'wert',
    'en.some.key': 'value',
}, {multiLocale: true});

  it('provides translate function which uses entry locale by default', () => {
    const {result} = renderHookInEntry(
      () => useI18n(),
      {
        seed: {
          entry: {
            locale: 'de'
          }
        }
      }
    );

    const {t} = result.current;

    expect(t('some.key')).toEqual('wert');
  });

  it('supports using ui locale instead', () => {
    const {result} = renderHookInEntry(
      () => useI18n({locale: 'ui'}),
      {
        seed: {
          entry: {
            locale: 'de'
          }
        }
      }
    );

    const {t} = result.current;

    expect(t('some.key')).toEqual('value');
  });
});
