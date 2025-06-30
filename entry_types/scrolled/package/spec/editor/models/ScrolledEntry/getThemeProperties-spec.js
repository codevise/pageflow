import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('ScrolledEntry#getThemeProperties', () => {
  it('returns theme properties when available', () => {
    const entry = factories.entry(
      ScrolledEntry,
      {},
      {
        entryTypeSeed: normalizeSeed({
          themeOptions: {
            properties: {
              root: {
                'contentElementBoxBorderRadius': '8px',
                'contentElementBoxBorderRadius-sm': '4px'
              },
              dark: {
                'backgroundColor': '#000000'
              }
            }
          }
        })
      }
    );

    const result = entry.getThemeProperties();

    expect(result).toEqual({
      root: {
        'contentElementBoxBorderRadius': '8px',
        'contentElementBoxBorderRadius-sm': '4px'
      },
      dark: {
        'backgroundColor': '#000000'
      }
    });
  });

  it('returns empty object when no theme properties available', () => {
    const entry = factories.entry(
      ScrolledEntry,
      {},
      {
        entryTypeSeed: normalizeSeed({
          themeOptions: {}
        })
      }
    );

    const result = entry.getThemeProperties();

    expect(result).toEqual({});
  });

  it('returns empty object when theme options is undefined', () => {
    const entry = factories.entry(
      ScrolledEntry,
      {},
      {
        entryTypeSeed: normalizeSeed({})
      }
    );

    const result = entry.getThemeProperties();

    expect(result).toEqual({});
  });
});