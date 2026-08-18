import {getViewTimelineProgress} from 'frontend/viewTimelineRanges';

describe('getViewTimelineProgress', () => {
  function progress({range = 'cover', top, height = 500, viewportHeight = 1000}) {
    return getViewTimelineProgress({
      range,
      subjectRect: {top, height},
      elementRect: {top, height},
      viewportHeight
    });
  }

  describe('cover range', () => {
    it('is 0 while subject is about to enter viewport', () => {
      expect(progress({top: 1000})).toEqual(0);
    });

    it('is 1 once subject has completely left viewport', () => {
      expect(progress({top: -500})).toEqual(1);
    });

    it('is 0.5 when subject has covered half the distance', () => {
      expect(progress({top: 250})).toEqual(0.5);
    });

    it('is clamped below viewport', () => {
      expect(progress({top: 2000})).toEqual(0);
    });

    it('is clamped above viewport', () => {
      expect(progress({top: -1500})).toEqual(1);
    });
  });

  describe('entry range', () => {
    it('is 0 while subject is about to enter viewport', () => {
      expect(progress({range: 'entry', top: 1000})).toEqual(0);
    });

    it('is 1 once subject is completely inside viewport', () => {
      expect(progress({range: 'entry', top: 500})).toEqual(1);
    });

    it('is 0.5 when subject has entered halfway', () => {
      expect(progress({range: 'entry', top: 750})).toEqual(0.5);
    });

    it('stays 1 while subject moves further up', () => {
      expect(progress({range: 'entry', top: 0})).toEqual(1);
    });
  });

  describe('exit range', () => {
    it('is 0 while subject is about to leave viewport', () => {
      expect(progress({range: 'exit', top: 0})).toEqual(0);
    });

    it('is 1 once subject has completely left viewport', () => {
      expect(progress({range: 'exit', top: -500})).toEqual(1);
    });

    it('is 0.5 when subject has left halfway', () => {
      expect(progress({range: 'exit', top: -250})).toEqual(0.5);
    });

    it('stays 0 while subject is still completely inside viewport', () => {
      expect(progress({range: 'exit', top: 300})).toEqual(0);
    });
  });

  describe('center range', () => {
    it('is 0 while subject is about to reach center of viewport', () => {
      expect(progress({range: 'center', top: 500})).toEqual(0);
    });

    it('is 1 once subject has completely passed center of viewport', () => {
      expect(progress({range: 'center', top: 0})).toEqual(1);
    });

    it('is 0.5 while subject is centered in viewport', () => {
      expect(progress({range: 'center', top: 250})).toEqual(0.5);
    });

    it('is clamped below center of viewport', () => {
      expect(progress({range: 'center', top: 1000})).toEqual(0);
    });

    it('is clamped above center of viewport', () => {
      expect(progress({range: 'center', top: -500})).toEqual(1);
    });
  });

  describe('contain range for subject smaller than viewport', () => {
    it('is 0 once subject is completely inside viewport', () => {
      expect(progress({range: 'contain', top: 500})).toEqual(0);
    });

    it('is 1 while subject is about to leave viewport', () => {
      expect(progress({range: 'contain', top: 0})).toEqual(1);
    });

    it('is 0.5 in the middle of the viewport', () => {
      expect(progress({range: 'contain', top: 250})).toEqual(0.5);
    });
  });

  describe('contain range for subject taller than viewport', () => {
    it('is 0 once subject covers viewport', () => {
      expect(progress({range: 'contain', top: 0, height: 1500})).toEqual(0);
    });

    it('is 1 while subject is about to stop covering viewport', () => {
      expect(progress({range: 'contain', top: -500, height: 1500})).toEqual(1);
    });

    it('is 0.5 in the middle', () => {
      expect(progress({range: 'contain', top: -250, height: 1500})).toEqual(0.5);
    });
  });

  it('is 1 for subject of exactly viewport height in contain range', () => {
    expect(progress({range: 'contain', top: 0, height: 1000})).toEqual(1);
  });

  describe('for element pinned along a taller subject', () => {
    function pinnedElementProgress({range = 'cover',
                                    subjectTop,
                                    subjectHeight = 2000,
                                    elementTop = 0,
                                    elementHeight = 500,
                                    viewportHeight = 1000}) {
      return getViewTimelineProgress({
        range,
        subjectRect: {top: subjectTop, height: subjectHeight},
        elementRect: {top: elementTop, height: elementHeight},
        viewportHeight
      });
    }

    it('measures cover range along the subject', () => {
      expect(pinnedElementProgress({subjectTop: 1000})).toEqual(0);
      expect(pinnedElementProgress({subjectTop: -500})).toEqual(0.5);
      expect(pinnedElementProgress({subjectTop: -2000})).toEqual(1);
    });

    it('starts contain range once element is completely inside viewport', () => {
      expect(pinnedElementProgress({range: 'contain', subjectTop: 500})).toEqual(0);
    });

    it('ends contain range once element starts leaving viewport', () => {
      expect(pinnedElementProgress({range: 'contain', subjectTop: -1500})).toEqual(1);
    });

    it('keeps advancing contain range while element is pinned', () => {
      expect(pinnedElementProgress({range: 'contain', subjectTop: -500})).toEqual(0.5);
    });

    it('ends entry range once element is completely inside viewport', () => {
      expect(pinnedElementProgress({range: 'entry', subjectTop: 750})).toEqual(0.5);
      expect(pinnedElementProgress({range: 'entry', subjectTop: 500})).toEqual(1);
    });

    it('starts exit range once element starts leaving viewport', () => {
      expect(pinnedElementProgress({range: 'exit', subjectTop: -1500})).toEqual(0);
      expect(pinnedElementProgress({range: 'exit', subjectTop: -1750})).toEqual(0.5);
    });

    it('measures center range along the subject', () => {
      expect(pinnedElementProgress({range: 'center', subjectTop: 500})).toEqual(0);
      expect(pinnedElementProgress({range: 'center', subjectTop: -500})).toEqual(0.5);
      expect(pinnedElementProgress({range: 'center', subjectTop: -1500})).toEqual(1);
    });

    describe('pinned range', () => {
      it('is 0 before the element has reached its pinned position', () => {
        expect(pinnedElementProgress({
          range: 'pinned', subjectTop: 500, elementTop: 500
        })).toEqual(0);
      });

      it('is 0 once the element reaches its pinned position', () => {
        expect(pinnedElementProgress({
          range: 'pinned', subjectTop: 300, elementTop: 300
        })).toEqual(0);
      });

      it('is 0.5 halfway through the pinned phase', () => {
        expect(pinnedElementProgress({
          range: 'pinned', subjectTop: -450, elementTop: 300
        })).toEqual(0.5);
      });

      it('is 1 once the element leaves its pinned position', () => {
        expect(pinnedElementProgress({
          range: 'pinned', subjectTop: -1200, elementTop: 300
        })).toEqual(1);
      });

      it('is 1 after the element has left its pinned position', () => {
        expect(pinnedElementProgress({
          range: 'pinned', subjectTop: -1500, elementTop: 0
        })).toEqual(1);
      });

      it('stays 1 for elements that never reach a pinned position', () => {
        expect(pinnedElementProgress({
          range: 'pinned', subjectTop: 250, subjectHeight: 300, elementTop: 250
        })).toEqual(1);
      });
    });

    describe('inFocus range', () => {
      it('measures pinned range while element has a pinned phase', () => {
        expect(pinnedElementProgress({
          range: 'inFocus', subjectTop: -150, elementTop: 300
        })).toEqual(0.3);
      });

      it('measures center range if element is never pinned', () => {
        expect(pinnedElementProgress({
          range: 'inFocus', subjectTop: 250, subjectHeight: 300, elementTop: 250
        })).toEqual(0.5);
      });
    });

    it('measures along element if subject is not taller than element', () => {
      expect(pinnedElementProgress({
        range: 'contain', subjectTop: 250, subjectHeight: 300, elementTop: 250
      })).toEqual(0.5);
    });
  });

  it('throws descriptive error for unknown range', () => {
    expect(() => progress({range: 'crossing', top: 0}))
      .toThrow(/Unknown view timeline range 'crossing'.*inFocus/);
  });
});
