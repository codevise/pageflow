import {useI18n} from 'frontend/i18n';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderHookInEntry} from 'support';

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
