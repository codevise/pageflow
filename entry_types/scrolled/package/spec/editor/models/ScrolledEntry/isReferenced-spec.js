import {useEditorGlobals} from 'support';

describe('ScrolledEntry', () => {
  describe('is_referenced attribute of files', () => {
    const {createEntry} = useEditorGlobals();

    const inlineImageLocations = {
      contentElements: {inlineImage: [{path: ['id'], collection: 'imageFiles'}]}
    };

    function create({contentElements, ...options}) {
      return createEntry({
        chapters: [{id: 1, permaId: 100}],
        sections: [{id: 1, permaId: 10, chapterId: 1}],
        contentElements: contentElements.map((contentElement, index) => ({
          id: index + 1, permaId: index + 20, sectionId: 1, ...contentElement
        })),
        ...options
      });
    }

    function file(entry, collectionName, permaId) {
      return entry.getFileCollection(collectionName).findWhere({perma_id: permaId});
    }

    it('is set for referenced and unreferenced files', () => {
      const entry = create({
        imageFiles: [{id: 1, perma_id: 5}, {id: 2, perma_id: 6}],
        contentElements: [{typeName: 'inlineImage', configuration: {id: 5}}],
        fileReferenceLocations: inlineImageLocations
      });

      expect(file(entry, 'image_files', 5).get('is_referenced')).toBe(true);
      expect(file(entry, 'image_files', 6).get('is_referenced')).toBe(false);
    });

    it('is set for files linked from content elements', () => {
      const entry = create({
        imageFiles: [{id: 1, perma_id: 5}],
        contentElements: [{
          typeName: 'textBlock',
          configuration: {value: [{type: 'paragraph', children: [
            {type: 'link', href: {file: {permaId: 5, collectionName: 'imageFiles'}},
             children: [{text: 'Download'}]}
          ]}]}
        }]
      });

      expect(file(entry, 'image_files', 5).get('is_referenced')).toBe(true);
    });

    it('is false for files of inactive references', () => {
      const entry = create({
        imageFiles: [{id: 1, perma_id: 5}],
        contentElements: [{typeName: 'inlineVideo', configuration: {portraitPosterId: 5}}],
        fileReferenceLocations: {
          contentElements: {
            inlineVideo: [{path: ['portraitPosterId'], collection: 'imageFiles',
                           activeIf: {path: ['portraitId'], present: true}}]
          }
        }
      });

      expect(file(entry, 'image_files', 5).get('is_referenced')).toBe(false);
    });

    it('is set for nested files of referenced files', () => {
      const entry = create({
        videoFiles: [{id: 1, perma_id: 5}, {id: 2, perma_id: 6}],
        textTrackFiles: [
          {id: 10, perma_id: 50, parent_file_id: 1, parent_file_model_type: 'Pageflow::VideoFile'},
          {id: 11, perma_id: 51, parent_file_id: 2, parent_file_model_type: 'Pageflow::VideoFile'}
        ],
        contentElements: [{typeName: 'inlineVideo', configuration: {id: 5}}],
        fileReferenceLocations: {
          contentElements: {inlineVideo: [{path: ['id'], collection: 'videoFiles'}]}
        },
        fileModelTypes: {
          videoFiles: 'Pageflow::VideoFile',
          textTrackFiles: 'Pageflow::TextTrackFile'
        }
      });

      expect(file(entry, 'text_track_files', 50).get('is_referenced')).toBe(true);
      expect(file(entry, 'text_track_files', 51).get('is_referenced')).toBe(false);
    });

    it('is updated when parent of nested file is assigned', async () => {
      const entry = create({
        videoFiles: [{id: 1, perma_id: 5}],
        textTrackFiles: [{id: 10, perma_id: 50}],
        contentElements: [{typeName: 'inlineVideo', configuration: {id: 5}}],
        fileReferenceLocations: {
          contentElements: {inlineVideo: [{path: ['id'], collection: 'videoFiles'}]}
        }
      });
      const textTrackFile = file(entry, 'text_track_files', 50);

      textTrackFile.set('parent_file_id', 1);
      await Promise.resolve();
      textTrackFile.set('parent_file_model_type', 'Pageflow::VideoFile');
      await Promise.resolve();

      expect(textTrackFile.get('is_referenced')).toBe(true);
    });

    it('is updated when configuration of content element changes', () => {
      const entry = create({
        imageFiles: [{id: 1, perma_id: 5}, {id: 2, perma_id: 6}],
        contentElements: [{typeName: 'inlineImage', configuration: {id: 5}}],
        fileReferenceLocations: inlineImageLocations
      });

      entry.contentElements.first().configuration.set('id', 6);

      expect(file(entry, 'image_files', 5).get('is_referenced')).toBe(false);
      expect(file(entry, 'image_files', 6).get('is_referenced')).toBe(true);
    });

    it('is updated when content element is removed', async () => {
      const entry = create({
        imageFiles: [{id: 1, perma_id: 5}],
        contentElements: [{typeName: 'inlineImage', configuration: {id: 5}}],
        fileReferenceLocations: inlineImageLocations
      });

      entry.contentElements.remove(entry.contentElements.first());
      await Promise.resolve();

      expect(file(entry, 'image_files', 5).get('is_referenced')).toBe(false);
    });

    it('is set for files referenced by added content elements', async () => {
      const entry = create({
        imageFiles: [{id: 1, perma_id: 5}],
        contentElements: [],
        fileReferenceLocations: inlineImageLocations
      });

      entry.contentElements.add({id: 1, permaId: 20, sectionId: 1, typeName: 'inlineImage',
                                 configuration: {id: 5}});
      await Promise.resolve();

      expect(file(entry, 'image_files', 5).get('is_referenced')).toBe(true);
    });

    it('is updated once when several content elements are added', async () => {
      const entry = create({
        imageFiles: [{id: 1, perma_id: 5}],
        contentElements: [],
        fileReferenceLocations: inlineImageLocations
      });
      const imageFile = file(entry, 'image_files', 5);
      jest.spyOn(imageFile, 'set');

      entry.contentElements.add([
        {id: 1, permaId: 20, sectionId: 1, typeName: 'inlineImage', configuration: {id: 5}},
        {id: 2, permaId: 21, sectionId: 1, typeName: 'inlineImage', configuration: {id: 5}}
      ]);
      await Promise.resolve();

      expect(imageFile.set.mock.calls.filter(([name]) => name === 'is_referenced').length)
        .toBe(1);
    });

    it('is updated when section configuration changes', () => {
      const entry = create({
        imageFiles: [{id: 1, perma_id: 5}],
        contentElements: [],
        fileReferenceLocations: {
          sections: [{path: ['backdrop', 'image'], collection: 'imageFiles'}]
        }
      });

      entry.sections.first().configuration.set('backdrop', {image: 5});

      expect(file(entry, 'image_files', 5).get('is_referenced')).toBe(true);
    });

    it('is updated when share image of entry changes', () => {
      const entry = create({
        imageFiles: [{id: 1, perma_id: 5}],
        contentElements: [],
        fileReferenceLocations: {
          entry: [{path: ['shareImageId'], collection: 'imageFiles'}]
        }
      });

      entry.metadata.set('share_image_id', 5);

      expect(file(entry, 'image_files', 5).get('is_referenced')).toBe(true);
    });

    it('is set for files added to the entry', async () => {
      const entry = create({
        imageFiles: [],
        contentElements: [{typeName: 'inlineImage', configuration: {id: 5}}],
        fileReferenceLocations: inlineImageLocations
      });

      entry.getFileCollection('image_files').add({id: 1, perma_id: 5});
      await Promise.resolve();

      expect(file(entry, 'image_files', 5).get('is_referenced')).toBe(true);
    });

    it('is updated once when several files are added', async () => {
      const entry = create({
        imageFiles: [{id: 1, perma_id: 5}],
        contentElements: [{typeName: 'inlineImage', configuration: {id: 5}}],
        fileReferenceLocations: inlineImageLocations
      });
      const imageFile = file(entry, 'image_files', 5);
      jest.spyOn(imageFile, 'set');

      entry.getFileCollection('image_files').add([{id: 2, perma_id: 6}, {id: 3, perma_id: 7}]);
      entry.getFileCollection('image_files').add({id: 4, perma_id: 8});
      await Promise.resolve();

      expect(imageFile.set.mock.calls.filter(([name]) => name === 'is_referenced').length)
        .toBe(1);
    });

    it('does not save files when it changes', () => {
      const entry = create({
        imageFiles: [{id: 1, perma_id: 5}],
        contentElements: [{typeName: 'inlineImage', configuration: {id: 5}}],
        fileReferenceLocations: inlineImageLocations
      });
      const imageFile = file(entry, 'image_files', 5);
      jest.spyOn(imageFile, 'save');

      entry.contentElements.first().configuration.set('id', 6);

      expect(imageFile.save).not.toHaveBeenCalled();
    });
  });
});
