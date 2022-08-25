import {useBackgroundFile} from 'frontend/useBackgroundFile';
import {useFile} from 'entryState';

import {renderHookInEntry} from 'support';

describe('useBackgroundFile', () => {
  it('returns null if file is null', () => {
    const {result} = renderHookInEntry(() => useBackgroundFile({
      file: null,
      containerDimension: {width: 200, height: 100}
    }));

    expect(result.current).toBeNull();
  });

  it('includes passed effects in result', () => {
    const {result} = renderHookInEntry(
      () => useBackgroundFile({
        file: useFile({collectionName: 'imageFiles', permaId: 10}),
        effects: [{name: 'blur', value: 50}]
      }),
      {
        seed: {
          imageFiles: [{permaId: 10}]
        }
      }
    );

    expect(result.current.effects).toEqual([{name: 'blur', value: 50}]);
  });

  it('sets motif area image based on passed motif area', () => {
    const {result} = renderHookInEntry(
      () => useBackgroundFile({
        file: useFile({collectionName: 'imageFiles', permaId: 10}),
        motifArea: {left: 20, top: 10, width: 50, height: 60},
      }),
      {
        seed: {
          imageFiles: [{
            permaId: 10,
            configuration: {
              motifArea: {left: 30, top: 20, width: 60, height: 70}
            }
          }]
        }
      });

    expect(result.current.motifArea).toEqual({left: 20, top: 10, width: 50, height: 60});
  });
});
