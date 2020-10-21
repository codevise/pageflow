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

  it('sets motif area image based on passed motif area', () => {
    const {result} = renderHookInEntry(
      () => useBackgroundFile({
        file: useFile({collectionName: 'imageFiles', permaId: 10}),
        motifArea: {left: 20, top: 10, width: 50, height: 60},
        containerDimension: {width: 200, height: 100}
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

  it('falls back to motif area from file configuration if passed motif area is undefined', () => {
    const {result} = renderHookInEntry(
      () => useBackgroundFile({
        file: useFile({collectionName: 'imageFiles', permaId: 10}),
        containerDimension: {width: 200, height: 100}
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

    expect(result.current.motifArea).toEqual({left: 30, top: 20, width: 60, height: 70});
  });

  describe('cropPosition property', () => {
    // The following tests assume that there is an image with size
    // 2000x1000 with a specified motif area. We want to display this
    // image in a container such that the container is covered and the
    // motif area is centered in the container.
    //
    // Each cell in the following matrices represents an area 10
    // pixels wide and 20 pixels high (the different scales are used to
    // make proportions work even though each character is about twice
    // as high as wide).
    //
    // o: Part of the image that is visible in the container
    // .: Part of the image that is clipped
    // X: Part of the motif area that is visible in the container
    // x: Part of the motif area that is clipped
    it('ensures motif area at bottom right edge of image is completely visible if it fits viewport', () => {
      // ...............ooooo
      // ...............ooooo
      // ...............ooooo
      // ...............ooooo
      // ...............oooXX
      const {result} = renderHookInEntry(
        () => useBackgroundFile({
          file: useFile({collectionName: 'imageFiles', permaId: 10}),
          motifArea: {left: 90, top: 80, width: 10, height: 20},
          containerDimension: {width: 50, height: 100}
        }),
        {seed: {imageFiles: [{permaId: 10, width: 2000, height: 1000}]}}
      );

      expect(result.current.cropPosition.x).toEqual(100);
      expect(result.current.cropPosition.y).toEqual(50);
      expect(result.current.motifAreaOffsetRect).toEqual({
        left: 30,
        top: 80,
        width: 20,
        height: 20
      });
    });

    it('ensures motif area at top left edge of image is completely visible if it fits viewport', () => {
      // XXooo...............
      // ooooo...............
      // ooooo...............
      // ooooo...............
      // ooooo...............
      const {result} = renderHookInEntry(
        () => useBackgroundFile({
          file: useFile({collectionName: 'imageFiles', permaId: 10}),
          motifArea: {left: 0, top: 0, width: 10, height: 20},
          containerDimension: {width: 50, height: 100}
        }),
        {seed: {imageFiles: [{permaId: 10, width: 2000, height: 1000}]}}
      );

      expect(result.current.cropPosition.x).toEqual(0);
      expect(result.current.cropPosition.y).toEqual(50);
      expect(result.current.motifAreaOffsetRect).toEqual({
        left: 0,
        top: 0,
        width: 20,
        height: 20
      });
    });

    it('ensures motif area is centered in viewport if it is wider than the viewport ', () => {
      // xxXXXXXxx...........
      // ..ooooo.............
      // ..ooooo.............
      // ..ooooo.............
      // ..ooooo.............
      const {result} = renderHookInEntry(
        () => useBackgroundFile({
          file: useFile({collectionName: 'imageFiles', permaId: 10}),
          motifArea: {left: 0, top: 0, width: 45, height: 20},
          containerDimension: {width: 50, height: 100}
        }),
        {seed: {imageFiles: [{permaId: 10, width: 2000, height: 1000}]}}
      );

      expect(result.current.cropPosition.x).toBeCloseTo(13.333);
      expect(result.current.cropPosition.y).toEqual(50);
      expect(result.current.motifAreaOffsetRect).toEqual({
        left: -20,
        top: 0,
        width: 90,
        height: 20
      });
    });

    it('ensures motif area is centered in viewport if it is taller than the viewport ', () => {
      // ....................
      // ..........xxxx......
      // ooooooooooXXXXoooooo
      // ooooooooooXXXXoooooo
      // ..........xxxx......
      const {result} = renderHookInEntry(
        () => useBackgroundFile({
          file: useFile({collectionName: 'imageFiles', permaId: 10}),
          motifArea: {left: 50, top: 20, width: 20, height: 80},
          containerDimension: {width: 200, height: 40}
        }),
        {seed: {imageFiles: [{permaId: 10, width: 2000, height: 1000}]}}
      );

      expect(result.current.cropPosition.x).toEqual(50);
      expect(result.current.cropPosition.y).toBeCloseTo(66.666);
      expect(result.current.motifAreaOffsetRect).toEqual({
        left: 100,
        top: -20,
        width: 40,
        height: 80
      });
    });
  });

  it('does not fall back to motif area from file configuration if passed motif area is null', () => {
    const {result} = renderHookInEntry(
      () => useBackgroundFile({
        file: useFile({collectionName: 'imageFiles', permaId: 10}),
        motifArea: null,
        containerDimension: {width: 200, height: 100}
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

    expect(result.current.motifArea).toBeNull();
    expect(result.current.cropPosition.x).toEqual(50);
    expect(result.current.cropPosition.y).toEqual(50);
  });
});
