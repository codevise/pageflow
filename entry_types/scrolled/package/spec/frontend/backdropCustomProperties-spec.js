import {
  useBackdropFileCustomProperties,
  useBackdropMotifAreaCustomProperties
} from 'frontend/backdropCustomProperties';
import {useBackdropFile} from 'frontend/useBackdrop';

import {renderHookInEntry} from 'support';

describe('useBackdropFileCustomProperties', () => {
  it('returns empty object by default', () => {
    const {result} = renderHookInEntry(
      () => useBackdropFileCustomProperties({})
    );

    expect(result.current).toEqual({});
  });

  it('returns empty object if file is not ready', () => {
    const {result} = renderHookInEntry(
      () => useBackdropFileCustomProperties({
        file: useBackdropFile({
          permaId: 10,
          collectionName: 'imageFiles'
        })
      }),
      {
        seed: {
          imageFiles: [{permaId: 10, isReady: false}]
        }
      }
    );

    expect(result.current).toEqual({});
  });

  it('includes dimension properties for main file', () => {
    const {result} = renderHookInEntry(
      () => useBackdropFileCustomProperties({
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

  it('includes properties for mobile file', () => {
    const {result} = renderHookInEntry(
      () => useBackdropFileCustomProperties({
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
      '--mobile-backdrop-w': 768,
      '--mobile-backdrop-h': 1024
    });
  });
});

describe('useBackdropMotifAreaCustomProperties', () => {
  it('returns empty object by default', () => {
    const {result} = renderHookInEntry(
      () => useBackdropMotifAreaCustomProperties({})
    );

    expect(result.current).toEqual({});
  });

  it('includes motif area properties for main file', () => {
    const {result} = renderHookInEntry(
      () => useBackdropMotifAreaCustomProperties({
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
      () => useBackdropMotifAreaCustomProperties({
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
      '--motif-t': 0,
      '--motif-l': 20,
      '--motif-w': 30,
      '--motif-h': 10,
      '--mobile-motif-t': 10,
      '--mobile-motif-l': 0,
      '--mobile-motif-w': 40,
      '--mobile-motif-h': 15
    });
  });

  it('includes zoom properties', () => {
    const {result} = renderHookInEntry(
      () => useBackdropMotifAreaCustomProperties({
        file: useBackdropFile({
          permaId: 10,
          collectionName: 'imageFiles',
          motifArea: {top: 0, left: 20, width: 30, height: 10},
          effects: [{name: 'zoom', value: 20}]
        }),
        mobileFile: useBackdropFile({
          permaId: 11,
          collectionName: 'imageFiles',
          motifArea: {top: 10, left: 0, width: 40, height: 15},
          effects: [{name: 'zoom', value: 10}]
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
      '--backdrop-zoom': 20,
      '--mobile-backdrop-zoom': 10
    });
  });
});
