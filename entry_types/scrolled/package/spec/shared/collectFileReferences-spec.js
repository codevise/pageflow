import {collectFileReferences} from 'shared/collectFileReferences';

describe('collectFileReferences', () => {
  it('returns reference for top level property', () => {
    const locations = [{path: ['image'], collection: 'imageFiles'}];
    const configuration = {image: 5};

    expect(collectFileReferences({locations, configuration}))
      .toEqual([{collectionName: 'imageFiles', permaId: 5, path: ['image'], active: true}]);
  });

  it('skips property that is not set', () => {
    const locations = [{path: ['image'], collection: 'imageFiles'}];

    expect(collectFileReferences({locations, configuration: {}})).toEqual([]);
  });

  it('skips property that is null', () => {
    const locations = [{path: ['image'], collection: 'imageFiles'}];

    expect(collectFileReferences({locations, configuration: {image: null}})).toEqual([]);
  });

  it('skips value that is not a perma id', () => {
    const locations = [{path: ['backdrop', 'image'], collection: 'imageFiles'}];
    const configuration = {backdrop: {image: '#ff0000'}};

    expect(collectFileReferences({locations, configuration})).toEqual([]);
  });

  it('returns empty array without references', () => {
    expect(collectFileReferences({locations: [], configuration: {image: 5}})).toEqual([]);
  });

  it('returns reference from nested object', () => {
    const locations = [{path: ['tooltip', 'image'], collection: 'imageFiles'}];
    const configuration = {tooltip: {image: 5}};

    expect(collectFileReferences({locations, configuration}))
      .toEqual([{collectionName: 'imageFiles', permaId: 5,
                 path: ['tooltip', 'image'], active: true}]);
  });

  it('returns references from array items', () => {
    const locations = [{path: ['areas', '*', 'image'], collection: 'imageFiles'}];
    const configuration = {areas: [{image: 5}, {}, {image: 6}]};

    expect(collectFileReferences({locations, configuration}).map(({permaId}) => permaId))
      .toEqual([5, 6]);
  });

  it('resolves wildcards in paths of array items', () => {
    const locations = [{path: ['areas', '*', 'image'], collection: 'imageFiles'}];
    const configuration = {areas: [{image: 5}, {}, {image: 6}]};

    expect(collectFileReferences({locations, configuration}).map(({path}) => path))
      .toEqual([['areas', '0', 'image'], ['areas', '2', 'image']]);
  });

  it('returns references from values of map with dynamic keys', () => {
    const locations = [{path: ['tooltipTexts', '*', 'image'], collection: 'imageFiles'}];
    const configuration = {tooltipTexts: {1: {image: 5}, 2: {image: 6}}};

    expect(collectFileReferences({locations, configuration}).map(({permaId}) => permaId))
      .toEqual([5, 6]);
  });

  it('resolves wildcards in paths of map values', () => {
    const locations = [{path: ['tooltipTexts', '*', 'image'], collection: 'imageFiles'}];
    const configuration = {tooltipTexts: {1: {image: 5}, 2: {image: 6}}};

    expect(collectFileReferences({locations, configuration}).map(({path}) => path))
      .toEqual([['tooltipTexts', '1', 'image'], ['tooltipTexts', '2', 'image']]);
  });

  it('skips nested path that is not set', () => {
    const locations = [{path: ['tooltip', 'image'], collection: 'imageFiles'}];

    expect(collectFileReferences({locations, configuration: {}})).toEqual([]);
  });

  describe('conditions', () => {
    it('marks reference active when value matches', () => {
      const locations = [{
        path: ['backdropVideo'],
        collection: 'videoFiles',
        activeIf: {path: ['backdropType'], value: 'video'}
      }];
      const configuration = {backdropType: 'video', backdropVideo: 5};

      expect(collectFileReferences({locations, configuration})[0].active).toEqual(true);
    });

    it('marks reference inactive when value differs', () => {
      const locations = [{
        path: ['backdropVideo'],
        collection: 'videoFiles',
        activeIf: {path: ['backdropType'], value: 'video'}
      }];
      const configuration = {backdropType: 'image', backdropVideo: 5};

      expect(collectFileReferences({locations, configuration})[0].active).toEqual(false);
    });

    it('supports negated value', () => {
      const locations = [{
        path: ['backdropImage'],
        collection: 'imageFiles',
        activeIf: {path: ['backdropType'], not: 'video'}
      }];
      const configuration = {backdropType: 'image', backdropImage: 5};

      expect(collectFileReferences({locations, configuration})[0].active).toEqual(true);
    });

    it('supports presence of other property', () => {
      const locations = [{
        path: ['areas', '*', 'portraitImage'],
        collection: 'imageFiles',
        activeIf: {path: ['portraitBackground'], present: true}
      }];
      const configuration = {areas: [{portraitImage: 5}]};

      expect(collectFileReferences({locations, configuration})[0].active).toEqual(false);
    });

    it('reads condition value from nested path', () => {
      const locations = [{
        path: ['backdrop', 'image'],
        collection: 'imageFiles',
        activeIf: {path: ['backdrop', 'video'], present: false}
      }];
      const configuration = {backdrop: {image: 5, video: 6}};

      expect(collectFileReferences({locations, configuration})[0].active).toEqual(false);
    });

    it('supports list of values', () => {
      const locations = [{
        path: ['image'],
        collection: 'imageFiles',
        activeIf: {path: ['backdropType'], not: ['video', 'color']}
      }];
      const configuration = {backdropType: 'color', image: 5};

      expect(collectFileReferences({locations, configuration})[0].active).toEqual(false);
    });

    it('requires all conditions of a list to hold', () => {
      const locations = [{
        path: ['image'],
        collection: 'imageFiles',
        activeIf: [{path: ['color'], present: false},
                   {path: ['video'], present: false}]
      }];

      expect(collectFileReferences({
        locations, configuration: {image: 5, video: 6}
      })[0].active).toEqual(false);

      expect(collectFileReferences({
        locations, configuration: {image: 5}
      })[0].active).toEqual(true);
    });

    it('reads condition value from configuration root', () => {
      const locations = [{
        path: ['areas', '*', 'portraitImage'],
        collection: 'imageFiles',
        activeIf: {path: ['portraitBackground'], present: true}
      }];
      const configuration = {portraitBackground: 7, areas: [{portraitImage: 5}]};

      expect(collectFileReferences({locations, configuration})[0].active).toEqual(true);
    });
  });
});
