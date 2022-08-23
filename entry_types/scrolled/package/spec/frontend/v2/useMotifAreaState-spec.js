import {useMotifAreaState} from 'frontend/v2/useMotifAreaState';

import {renderHook, act} from '@testing-library/react-hooks';
import {fireEvent} from '@testing-library/dom'
import {createElementWithDimension} from 'support/createElementWithDimension';

describe('useMotifAreaState', () => {
  function getMotifAreaState({
    contentArea,
    motifArea,
    empty,
    updateOnScrollAndResize,
    exposeMotifArea
  }) {
    const {result} = renderHook(() => useMotifAreaState({
      transitions: ['scrollIn', 'scrollOut'],
      empty,
      updateOnScrollAndResize,
      exposeMotifArea
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

    return result;
  }

  describe('intersectionRatioY', () => {
    describe('when exposeMotifArea is false', () => {
      it('equals 0 even if motif area is intersected by content area', () => {
        const [{intersectionRatioY}] = getMotifAreaState({
          contentArea: {left: 100, viewportTop: 400, width: 300},
          motifArea: {left: 200, viewportTop: 100, width: 500, height: 400},
          empty: false,
          exposeMotifArea: false
        }).current;

        expect(intersectionRatioY).toEqual(0);
      });
    });

    describe('when exposeMotifArea is true', () => {
      it('equals ratio of motif area that is intersected by content area', () => {
        const [{intersectionRatioY}] = getMotifAreaState({
          contentArea: {left: 100, viewportTop: 400, width: 300},
          motifArea: {left: 200, viewportTop: 100, width: 500, height: 400},
          empty: false,
          exposeMotifArea: true
        }).current;

        expect(intersectionRatioY).toEqual(0.25);
      });

      it('equals 0 if content area does not intersect with motif area horizontally', () => {
        const [{intersectionRatioY}] = getMotifAreaState({
          contentArea: {left: 100, viewportTop: 400, width: 300},
          motifArea: {left: 500, viewportTop: 100, width: 500, height: 400},
          empty: false,
          transitions: ['scrollIn', 'scrollOut'],
          exposeMotifArea: true
        }).current;

        expect(intersectionRatioY).toEqual(0);
      });

      it('equals 0 if section does not have content elements', () => {
        const [{intersectionRatioY}] = getMotifAreaState({
          contentArea: {left: 100, viewportTop: 400, width: 300},
          motifArea: {left: 200, viewportTop: 100, width: 500, height: 400},
          empty: true,
          exposeMotifArea: true
        }).current;

        expect(intersectionRatioY).toEqual(0);
      });

      it('equals 0 content intersects with zero height motif area', () => {
        const [{intersectionRatioY}] = getMotifAreaState({
          contentArea: {left: 100, viewportTop: 400, width: 300},
          motifArea: {left: 200, viewportTop: 100, width: 500, height: 0},
          empty: false,
          exposeMotifArea: true
        }).current;

        expect(intersectionRatioY).toEqual(0);
      });

      it('equals 0 if content area does not yet intersect with motif area vertically', () => {
        const [{intersectionRatioY}] = getMotifAreaState({
          contentArea: {left: 100, viewportTop: 1000, width: 300},
          motifArea: {left: 200, viewportTop: 100, width: 500, height: 400},
          empty: false,
          exposeMotifArea: true
        }).current;

        expect(intersectionRatioY).toEqual(0);
      });

      it('equals 1 if content area has moved past motif area vertically', () => {
        const [{intersectionRatioY}] = getMotifAreaState({
          contentArea: {left: 100, viewportTop: 0, width: 300},
          motifArea: {left: 200, viewportTop: 100, width: 500, height: 400},
          empty: false,
          exposeMotifArea: true
        }).current;

        expect(intersectionRatioY).toEqual(1);
      });

      it('is updated on scroll event when updateOnScrollAndResize is true', () => {
        let contentAreaViewportTop = 500;
        const result = getMotifAreaState({
          contentArea: {left: 100, viewportTop: () => contentAreaViewportTop, width: 300},
          motifArea: {left: 200, viewportTop: 100, width: 500, height: 400},
          empty: false,
          exposeMotifArea: true,
          updateOnScrollAndResize: true
        });

        let [{intersectionRatioY}] = result.current;
        expect(intersectionRatioY).toEqual(0);

        contentAreaViewportTop = 300
        act(() => { fireEvent.scroll(window); });

        [{intersectionRatioY}] = result.current;
        expect(intersectionRatioY).toEqual(0.5);
      });

      it('is not updated on scroll event when updateOnScrollAndResize is false', () => {
        let contentAreaViewportTop = 500;
        const result = getMotifAreaState({
          contentArea: {left: 100, viewportTop: () => contentAreaViewportTop, width: 300},
          motifArea: {left: 200, viewportTop: 100, width: 500, height: 400},
          empty: false,
          exposeMotifArea: true,
          updateOnScrollAndResize: false
        });

        let [{intersectionRatioY}] = result.current;
        expect(intersectionRatioY).toEqual(0);

        contentAreaViewportTop = 300
        act(() => { fireEvent.scroll(window); });

        [{intersectionRatioY}] = result.current;
        expect(intersectionRatioY).toEqual(0);
      });
    });
  });
});
