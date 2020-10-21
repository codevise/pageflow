import {useMotifAreaState} from 'frontend/useMotifAreaState';

import {renderHook, act} from '@testing-library/react-hooks';
import {createElementWithDimension} from 'support/createElementWithDimension';

describe('useMotifAreaState', () => {
  function getMotifAreaState({
    contentArea,
    motifArea,
    fullHeight,
    empty,
    transitions
  }) {
    const {result} = renderHook(() => useMotifAreaState({
      fullHeight,
      empty,
      transitions
    }));

    // Since there is no horizontal scrolling in Pageflow, `offsetLeft`
    // and `viewportLeft` coincide and can thus be captured in a
    // single `left` property to make the below tests more concise.
    const contentAreaEl = createElementWithDimension({
      offsetLeft: contentArea.left,
      viewportLeft: contentArea.left,
      ...contentArea,
    });
    const motifAreaEl = createElementWithDimension({
      offsetLeft: motifArea.left,
      viewportLeft: motifArea.left,
      ...motifArea
    });

    const [, setMotifAreaRect, setContentAreaRef] = result.current;

    act(() => {
      setMotifAreaRect(motifAreaEl);
      setContentAreaRef(contentAreaEl);
    });

    return result.current[0];
  }

  describe('isIntersectingX', () => {
    it('is true if content area overlaps motif area horizontally', () => {
      const {isIntersectingX} = getMotifAreaState({
        contentArea: {left: 100, width: 300},
        motifArea: {left: 200, width: 500, height: 100},
        empty: false,
        transitions: ['scrollIn', 'scrollOut']
      });

      expect(isIntersectingX).toEqual(true);
    });

    it('is false if content area does not overlap motif area horizontally', () => {
      const {isIntersectingX} = getMotifAreaState({
        contentArea: {left: 100, width: 300},
        motifArea: {left: 500, width: 500, height: 100},
        empty: false,
        transitions: ['scrollIn', 'scrollOut']
      });

      expect(isIntersectingX).toEqual(false);
    });

    it('is false if motif area has zero height', () => {
      const {isIntersectingX} = getMotifAreaState({
        contentArea: {left: 100, width: 300},
        motifArea: {left: 200, width: 500, height: 0},
        empty: false,
        transitions: ['scrollIn', 'scrollOut']
      });

      expect(isIntersectingX).toEqual(false);
    });

    it('is false if section does not have content elements', () => {
      const {isIntersectingX} = getMotifAreaState({
        contentArea: {left: 100, width: 300},
        motifArea: {left: 200, width: 500, height: 200},
        empty: true,
        transitions: ['scrollIn', 'scrollOut']
      });

      expect(isIntersectingX).toEqual(false);
    });
  });

  describe('padding', () => {
    it('is undefined if content does not intersect with motif area', () => {
      const {paddingTop} = getMotifAreaState({
        contentArea: {left: 0, width: 400},
        motifArea: {left: 500, offsetTop: 100, width: 500, height: 200},
        transitions: ['scrollIn', 'scrollOut']
      });

      expect(paddingTop).toBeUndefined();
    });

    it('is undefined if content intersects with zero height motif area', () => {
      const {paddingTop} = getMotifAreaState({
        contentArea: {left: 0, width: 400},
        motifArea: {left: 200, offsetTop: 100, width: 500, height: 0},
        transitions: ['scrollIn', 'scrollOut'],
      });

      expect(paddingTop).toBeUndefined();
    });

    describe('with content intersecting motif area', () => {
      describe('with fadeIn transition', () => {
        it('equals motif area top * 2/3 + height', () => {
          const {paddingTop} = getMotifAreaState({
            contentArea: {left: 0, width: 400},
            motifArea: {left: 200, offsetTop: 100, width: 500, height: 200},
            fullHeight: true,
            transitions: ['fadeIn', 'scrollOut'],
          });

          expect(paddingTop).toEqual(100 * 2/3 + 200);
        });
      });

      describe('with scrollIn transition', () => {
        it('equals motif area top + height', () => {
          const {paddingTop} = getMotifAreaState({
            contentArea: {left: 0, width: 400},
            motifArea: {left: 200, offsetTop: 100, width: 500, height: 200},
            transitions: ['scrollIn', 'scrollOut'],
          });

          expect(paddingTop).toEqual(100 + 200);
        });
      });

      describe('with reveal transition', () => {
        it('equals motif area height', () => {
          const {paddingTop} = getMotifAreaState({
            contentArea: {left: 0, width: 400},
            motifArea: {left: 200, offsetTop: 100, width: 500, height: 200},
            transitions: ['reveal', 'scrollOut'],
          });

          expect(paddingTop).toEqual(200);
        });
      });
    });
  });

  describe('minHeight', () => {
    describe('for full height section', () => {
      it('is undefined even if content intersects with motif area', () => {
        const {minHeight} = getMotifAreaState({
          contentArea: {left: 0, width: 400},
          motifArea: {left: 200, offsetTop: 100, width: 500, height: 200},
          fullHeight: true,
          transitions: ['scrollIn', 'scrollOut'],
        });

        expect(minHeight).toBeUndefined()
      });
    });

    describe('for dynamic height section', () => {
      it('is present even if content does not intersect with motif area', () => {
        const {minHeight} = getMotifAreaState({
          contentArea: {left: 0, width: 400},
          motifArea: {left: 500, offsetTop: 100, width: 500, height: 200},
          fullHeight: false,
          transitions: ['scrollIn', 'scrollOut'],
        });

        expect(minHeight).toBeGreaterThan(0)
      });

      describe('with scrollIn transition', () => {
        it('equals motif area top + height', () => {
          const {minHeight} = getMotifAreaState({
            contentArea: {left: 0, width: 400},
            motifArea: {left: 200, offsetTop: 100, width: 500, height: 200},
            fullHeight: false,
            transitions: ['scrollIn', 'scrollOut'],
          });

          expect(minHeight).toEqual(100 + 200)
        });
      });

      describe('with reveal/scrollOut transitions', () => {
        it('equals motif area bottom + height', () => {
          const {minHeight} = getMotifAreaState({
            contentArea: {left: 0, width: 400},
            motifArea: {left: 200, offsetTop: 100, width: 500, height: 200, offsetParentHeight: 1000},
            fullHeight: false,
            transitions: ['reveal', 'scrollOut'],
          });

          expect(minHeight).toEqual(700 + 200)
        });
      });

      describe('with reveal/conceal transitions', () => {
        it('equals motif area height', () => {
          const {minHeight} = getMotifAreaState({
            contentArea: {left: 0, width: 400},
            motifArea: {left: 200, offsetTop: 100, width: 500, height: 200},
            fullHeight: false,
            transitions: ['reveal', 'conceal'],
          });

          expect(minHeight).toEqual(200)
        });
      });
    });
  });

  describe('intersectionRatioY', () => {
    it('equals ratio of motif area that is intersected by content area', () => {
      const {intersectionRatioY} = getMotifAreaState({
        contentArea: {left: 100, viewportTop: 400, width: 300},
        motifArea: {left: 200, viewportTop: 100, width: 500, height: 400},
        empty: false,
        transitions: ['scrollIn', 'scrollOut']
      });

      expect(intersectionRatioY).toEqual(0.25);
    });

    it('equals 0 if content area does not intersect with motif area horizontally', () => {
      const {intersectionRatioY} = getMotifAreaState({
        contentArea: {left: 100, viewportTop: 400, width: 300},
        motifArea: {left: 500, viewportTop: 100, width: 500, height: 400},
        empty: false,
        transitions: ['scrollIn', 'scrollOut']
      });

      expect(intersectionRatioY).toEqual(0);
    });

    it('equals 0 if section does not have content elements', () => {
      const {intersectionRatioY} = getMotifAreaState({
        contentArea: {left: 100, viewportTop: 400, width: 300},
        motifArea: {left: 200, viewportTop: 100, width: 500, height: 400},
        empty: true,
        transitions: ['scrollIn', 'scrollOut']
      });

      expect(intersectionRatioY).toEqual(0);
    });

    it('equals 0 content intersects with zero height motif area', () => {
      const {intersectionRatioY} = getMotifAreaState({
        contentArea: {left: 100, viewportTop: 400, width: 300},
        motifArea: {left: 200, viewportTop: 100, width: 500, height: 0},
        empty: false,
        transitions: ['scrollIn', 'scrollOut']
      });

      expect(intersectionRatioY).toEqual(0);
    });

    it('equals 0 if content area does not yet intersect with motif area vertically', () => {
      const {intersectionRatioY} = getMotifAreaState({
        contentArea: {left: 100, viewportTop: 1000, width: 300},
        motifArea: {left: 200, viewportTop: 100, width: 500, height: 400},
        empty: false,
        transitions: ['scrollIn', 'scrollOut']
      });

      expect(intersectionRatioY).toEqual(0);
    });

    it('equals 1 if content area has moved past motif area vertically', () => {
      const {intersectionRatioY} = getMotifAreaState({
        contentArea: {left: 100, viewportTop: 0, width: 300},
        motifArea: {left: 200, viewportTop: 100, width: 500, height: 400},
        empty: false,
        transitions: ['scrollIn', 'scrollOut']
      });

      expect(intersectionRatioY).toEqual(1);
    });
  });
});
