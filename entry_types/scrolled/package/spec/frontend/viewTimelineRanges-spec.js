import {getViewTimelineProgress} from 'frontend/viewTimelineRanges';

describe('getViewTimelineProgress', () => {
  function progress({range = 'cover', top, height = 500, viewportHeight = 1000}) {
    return getViewTimelineProgress({
      range,
      rect: {top, height},
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

  it('throws descriptive error for unknown range', () => {
    expect(() => progress({range: 'crossing', top: 0}))
      .toThrow(/Unknown view timeline range 'crossing'/);
  });
});
