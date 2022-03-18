import {useAdditionalSeedData} from 'entryState';

import {renderHookInEntry} from 'support';

describe('useAdditionalSeedData', () => {
  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useAdditionalSeedData('someSeed'), {
        seed: {
          additionalSeedData: {
            someSeed: {text: 'some text'}
          }
        }
      }
    );

    const data = result.current;
    expect(data).toMatchObject({text: 'some text'});
  });

  it('throws error if seed data has not been registered', () => {
    const {result} = renderHookInEntry(
      () => useAdditionalSeedData('notThere')
    );

    expect(result.error).toEqual(new Error(
      "Could not find additional seed data with name 'notThere'."
    ));
  });
});
