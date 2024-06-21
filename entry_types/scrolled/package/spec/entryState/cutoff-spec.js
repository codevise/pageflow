import {useCutOff} from 'entryState';

import {renderHookInEntry} from 'support';

describe('useCutOff', () => {
  it('reads data from config', () => {
    const {result} = renderHookInEntry(
      () => useCutOff(), {
        seed: {
          cutOff: true
        }
      }
    );

    expect(result.current).toEqual(true);
  });
});
