import {useTheme} from 'entryState';

import {renderHookInEntry} from 'support';

describe('useTheme', () => {
  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useTheme(), {
        seed: {
          themeOptions: {
            some: 'option'
          }
        }
      }
    );

    const theme = result.current;
    expect(theme).toMatchObject({
      assets: {},
      options: {some: 'option'}
    });
  });
});
