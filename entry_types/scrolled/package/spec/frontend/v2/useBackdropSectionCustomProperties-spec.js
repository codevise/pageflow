import {
  useBackdropSectionCustomProperties
} from 'frontend/v2/useBackdropSectionCustomProperties';
import {useBackdropFile} from 'frontend/v2/useBackdrop';

import {renderHookInEntry} from 'support';

describe('useBackdropSectionCustomProperties', () => {
  it('returns empty object by default', () => {
    const {result} = renderHookInEntry(
      () => useBackdropSectionCustomProperties({})
    );

    expect(result.current).toEqual({});
  });

  it('includes dimension properties for main file', () => {
    const {result} = renderHookInEntry(
      () => useBackdropSectionCustomProperties({
        file: useBackdropFile({
          permaId: 10,
          collectionName: 'imageFiles'
        })
      }),
      {
        seed: {
          imageFiles: [{permaId: 10, width: 1024, height: 768}]
        }
      }
    );

    expect(result.current).toMatchObject({
      '--backdrop-w': 1024,
      '--backdrop-h': 768
    });
  });

  it('includes motif area properties for main file', () => {
    const {result} = renderHookInEntry(
      () => useBackdropSectionCustomProperties({
        file: useBackdropFile({
          permaId: 10,
          collectionName: 'imageFiles',
          motifArea: {top: 0, left: 20, width: 30, height: 10}
        })
      }),
      {
        seed: {
          imageFiles: [{permaId: 10}]
        }
      }
    );

    expect(result.current).toMatchObject({
      '--motif-t': 0,
      '--motif-l': 20,
      '--motif-w': 30,
      '--motif-h': 10
    });
  });

  it('includes properties for mobile file', () => {
    const {result} = renderHookInEntry(
      () => useBackdropSectionCustomProperties({
        file: useBackdropFile({
          permaId: 10,
          collectionName: 'imageFiles',
          motifArea: {top: 0, left: 20, width: 30, height: 10}
        }),
        mobileFile: useBackdropFile({
          permaId: 11,
          collectionName: 'imageFiles',
          motifArea: {top: 10, left: 0, width: 40, height: 15}
        }),
      }),
      {
        seed: {
          imageFiles: [
            {permaId: 10, width: 1024, height: 768},
            {permaId: 11, width: 768, height: 1024}
          ],
        }
      }
    );

    expect(result.current).toMatchObject({
      '--backdrop-w': 1024,
      '--backdrop-h': 768,
      '--motif-t': 0,
      '--motif-l': 20,
      '--motif-w': 30,
      '--motif-h': 10,
      '--mobile-backdrop-w': 768,
      '--mobile-backdrop-h': 1024,
      '--mobile-motif-t': 10,
      '--mobile-motif-l': 0,
      '--mobile-motif-w': 40,
      '--mobile-motif-h': 15
    });
  });
});
