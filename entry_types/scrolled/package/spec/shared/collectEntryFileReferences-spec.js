import {collectEntryFileReferences} from 'shared/collectEntryFileReferences';

describe('collectEntryFileReferences', () => {
  function collect({sections = [], contentElements = [], files = {}, locations = {}}) {
    return collectEntryFileReferences({
      collections: {sections, contentElements, ...files},
      locations,
      fileModelTypes: {
        imageFiles: 'Pageflow::ImageFile',
        videoFiles: 'Pageflow::VideoFile',
        textTrackFiles: 'Pageflow::TextTrackFile'
      }
    });
  }

  it('finds file referenced by section', () => {
    const references = collect({
      sections: [{id: 1, permaId: 10, configuration: {backdrop: {image: 5}}}],
      locations: {sections: [{path: ['backdrop', 'image'], collection: 'imageFiles'}]}
    });

    expect(references.of('imageFiles', 5))
      .toEqual([{subject: {model: 'section', permaId: 10},
                 path: ['backdrop', 'image'], active: true}]);
  });

  it('finds file referenced by content element', () => {
    const references = collect({
      sections: [{id: 1, permaId: 10}],
      contentElements: [{id: 2, permaId: 20, sectionId: 1, typeName: 'inlineImage',
                         configuration: {id: 5}}],
      locations: {contentElements: {inlineImage: [{path: ['id'], collection: 'imageFiles'}]}}
    });

    expect(references.of('imageFiles', 5))
      .toEqual([{subject: {model: 'contentElement', permaId: 20},
                 path: ['id'], active: true}]);
  });

  it('is empty for file that is not referenced', () => {
    const references = collect({
      sections: [{id: 1, permaId: 10, configuration: {}}],
      locations: {sections: [{path: ['backdrop', 'image'], collection: 'imageFiles'}]}
    });

    expect(references.of('imageFiles', 5)).toEqual([]);
  });

  it('ignores content element types without locations', () => {
    const references = collect({
      sections: [{id: 1, permaId: 10}],
      contentElements: [{id: 2, permaId: 20, sectionId: 1, typeName: 'unknownType',
                         configuration: {id: 5}}],
      locations: {contentElements: {inlineImage: [{path: ['id'], collection: 'imageFiles'}]}}
    });

    expect(references.of('imageFiles', 5)).toEqual([]);
  });

  it('lists places in the order they appear in the entry', () => {
    const references = collect({
      sections: [{id: 1, permaId: 10, configuration: {backdrop: {image: 5}}},
                 {id: 2, permaId: 11, configuration: {backdrop: {image: 5}}}],
      contentElements: [{id: 3, permaId: 30, sectionId: 1, typeName: 'inlineImage',
                         configuration: {id: 5}}],
      locations: {
        sections: [{path: ['backdrop', 'image'], collection: 'imageFiles'}],
        contentElements: {inlineImage: [{path: ['id'], collection: 'imageFiles'}]}
      }
    });

    expect(references.of('imageFiles', 5).map(({subject}) => subject))
      .toEqual([{model: 'section', permaId: 10},
                {model: 'contentElement', permaId: 30},
                {model: 'section', permaId: 11}]);
  });

  it('includes resolved path of location', () => {
    const references = collect({
      sections: [{id: 1, permaId: 10}],
      contentElements: [{id: 2, permaId: 20, sectionId: 1, typeName: 'hotspots',
                         configuration: {areas: [{}, {tooltipImage: 5}]}}],
      locations: {
        contentElements: {
          hotspots: [{path: ['areas', '*', 'tooltipImage'], collection: 'imageFiles'}]
        }
      }
    });

    expect(references.of('imageFiles', 5).map(({path}) => path))
      .toEqual([['areas', '1', 'tooltipImage']]);
  });

  it('lists one reference per location', () => {
    const references = collect({
      sections: [{id: 1, permaId: 10, configuration: {backdrop: {image: 5, imageMobile: 5}}}],
      locations: {
        sections: [{path: ['backdrop', 'image'], collection: 'imageFiles'},
                   {path: ['backdrop', 'imageMobile'], collection: 'imageFiles'}]
      }
    });

    expect(references.of('imageFiles', 5).length).toEqual(2);
  });

  it('reports activeness per location', () => {
    const references = collect({
      sections: [{id: 1, permaId: 10, configuration: {backdrop: {image: 5, imageMobile: 5}}}],
      locations: {
        sections: [
          {path: ['backdrop', 'image'], collection: 'imageFiles',
           activeIf: {path: ['backdrop', 'color'], present: true}},
          {path: ['backdrop', 'imageMobile'], collection: 'imageFiles'}
        ]
      }
    });

    expect(references.of('imageFiles', 5).map(({active}) => active)).toEqual([false, true]);
  });

  it('reports inactive reference', () => {
    const references = collect({
      sections: [{id: 1, permaId: 10, configuration: {backdrop: {image: 5, video: 6}}}],
      locations: {
        sections: [{path: ['backdrop', 'image'], collection: 'imageFiles',
                    activeIf: {path: ['backdrop', 'video'], present: false}}]
      }
    });

    expect(references.of('imageFiles', 5))
      .toEqual([{subject: {model: 'section', permaId: 10},
                 path: ['backdrop', 'image'], active: false}]);
  });

  describe('nested files', () => {
    const files = {
      videoFiles: [{id: 100, permaId: 5}],
      textTrackFiles: [{id: 200, permaId: 6, parentFileId: 100,
                        parentFileModelType: 'Pageflow::VideoFile'}]
    };

    it('inherits references of parent file', () => {
      const references = collect({
        sections: [{id: 1, permaId: 10, configuration: {backdrop: {video: 5}}}],
        files,
        locations: {sections: [{path: ['backdrop', 'video'], collection: 'videoFiles'}]}
      });

      expect(references.of('textTrackFiles', 6))
        .toEqual([{subject: {model: 'section', permaId: 10},
                   path: ['backdrop', 'video'], active: true}]);
    });

    it('is empty if parent file is not referenced', () => {
      const references = collect({
        sections: [{id: 1, permaId: 10, configuration: {}}],
        files,
        locations: {sections: [{path: ['backdrop', 'video'], collection: 'videoFiles'}]}
      });

      expect(references.of('textTrackFiles', 6)).toEqual([]);
    });

    it('inherits activeness of parent file', () => {
      const references = collect({
        sections: [{id: 1, permaId: 10, configuration: {backdrop: {video: 5, color: '#fff'}}}],
        files,
        locations: {
          sections: [{path: ['backdrop', 'video'], collection: 'videoFiles',
                      activeIf: {path: ['backdrop', 'color'], present: false}}]
        }
      });

      expect(references.of('textTrackFiles', 6))
        .toEqual([{subject: {model: 'section', permaId: 10},
                   path: ['backdrop', 'video'], active: false}]);
    });
  });
});
