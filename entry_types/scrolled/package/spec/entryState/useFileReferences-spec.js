import {useFileReferences} from 'entryState';

import {renderHookInEntry} from 'support';

describe('useFileReferences', () => {
  it('indexes files referenced by content elements', () => {
    const {result} = renderHookInEntry(() => useFileReferences(), {
      seed: {
        imageFiles: [{permaId: 5}],
        contentElements: [{permaId: 20, typeName: 'someType', configuration: {image: 5}}],
        fileReferenceLocations: {
          contentElements: {
            someType: [{path: ['image'], collection: 'imageFiles'}]
          }
        }
      }
    });

    expect(result.current.of('imageFiles', 5))
      .toEqual([{subject: {model: 'contentElement', permaId: 20}, active: true}]);
  });

  it('indexes files referenced by sections', () => {
    const {result} = renderHookInEntry(() => useFileReferences(), {
      seed: {
        sections: [{permaId: 10, configuration: {backdrop: {image: 5}}}],
        fileReferenceLocations: {
          sections: [{path: ['backdrop', 'image'], collection: 'imageFiles'}]
        }
      }
    });

    expect(result.current.of('imageFiles', 5))
      .toEqual([{subject: {model: 'section', permaId: 10}, active: true}]);
  });

  it('indexes files referenced by entry metadata', () => {
    const {result} = renderHookInEntry(() => useFileReferences(), {
      seed: {
        entry: {shareImageId: 5},
        fileReferenceLocations: {
          entry: [{path: ['shareImageId'], collection: 'imageFiles'}]
        }
      }
    });

    expect(result.current.of('imageFiles', 5))
      .toEqual([{subject: {model: 'entry'}, active: true}]);
  });

  it('indexes files nested in a referenced file', () => {
    const {result} = renderHookInEntry(() => useFileReferences(), {
      seed: {
        videoFiles: [{id: 100, permaId: 5}],
        textTrackFiles: [{id: 200, permaId: 6, parentFileId: 100,
                          parentFileModelType: 'Pageflow::VideoFile'}],
        sections: [{permaId: 10, configuration: {backdrop: {video: 5}}}],
        fileReferenceLocations: {
          sections: [{path: ['backdrop', 'video'], collection: 'videoFiles'}]
        }
      }
    });

    expect(result.current.of('textTrackFiles', 6))
      .toEqual([{subject: {model: 'section', permaId: 10}, active: true}]);
  });

  it('is empty without locations in seed', () => {
    const {result} = renderHookInEntry(() => useFileReferences(), {
      seed: {
        contentElements: [{permaId: 20, typeName: 'someType', configuration: {image: 5}}]
      }
    });

    expect(result.current.of('imageFiles', 5)).toEqual([]);
  });
});
