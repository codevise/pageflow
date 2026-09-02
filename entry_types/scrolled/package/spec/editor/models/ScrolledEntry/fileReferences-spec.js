import {editor} from 'pageflow-scrolled/editor';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

describe('ScrolledEntry', () => {
  describe('#fileReferences', () => {
    useFakeTranslations({
      'pageflow_scrolled.editor.configuration_places.label': '%{chapter} - %{subject}',
      'pageflow_scrolled.editor.configuration_places.section': 'Section %{number}',
      'pageflow_scrolled.editor.chapter_item.chapter': 'Chapter',
      'pageflow_scrolled.editor.edit_section.attributes.backdropImage.label': 'Background image',
      'pageflow_scrolled.editor.edit_section.attributes.atmoAudioFileId.label': 'Atmo audio',
      'pageflow_scrolled.editor.content_elements.inlineImage.name': 'Image',
      'pageflow_scrolled.editor.content_elements.inlineImage.attributes.id.label': 'Image file',
      'pageflow_scrolled.editor.content_elements.customElement.name': 'Custom element',
      'pageflow_scrolled.editor.configuration_places.entry': 'Settings',
      'activerecord.attributes.pageflow/entry.share_image_id': 'Social Sharing Image'
    });

    const {createEntry} = useEditorGlobals();

    function create(options) {
      return createEntry({
        chapters: [{id: 1, permaId: 100, configuration: {title: 'Intro'}}],
        ...options
      });
    }

    function imageFile(entry, permaId) {
      return entry.getFileCollection('image_files').findWhere({perma_id: permaId});
    }

    it('lists section referencing a file', () => {
      const entry = create({
        imageFiles: [{perma_id: 5}],
        sections: [{id: 1, permaId: 10, chapterId: 1,
                    configuration: {backdrop: {image: 5}}}],
        fileReferenceLocations: {
          sections: [{path: ['backdrop', 'image'], collection: 'imageFiles'}]
        }
      });

      expect(entry.fileReferences().placesFor(imageFile(entry, 5)).map(({label}) => label))
        .toEqual(['Intro - Section 1']);
    });

    it('names untitled chapter by its number', () => {
      const entry = createEntry({
        chapters: [{id: 1, permaId: 100, position: 0}],
        imageFiles: [{perma_id: 5}],
        sections: [{id: 1, permaId: 10, chapterId: 1,
                    configuration: {backdrop: {image: 5}}}],
        fileReferenceLocations: {
          sections: [{path: ['backdrop', 'image'], collection: 'imageFiles'}]
        }
      });

      expect(entry.fileReferences().placesFor(imageFile(entry, 5)).map(({label}) => label))
        .toEqual(['Chapter 1 - Section 1']);
    });

    it('names the referencing property of a section', () => {
      const entry = create({
        imageFiles: [{perma_id: 5}],
        audioFiles: [{perma_id: 6}],
        sections: [{id: 1, permaId: 10, chapterId: 1,
                    configuration: {backdrop: {image: 5}, atmoAudioFileId: 6}}],
        fileReferenceLocations: {
          sections: [{path: ['backdrop', 'image'], collection: 'imageFiles'},
                     {path: ['atmoAudioFileId'], collection: 'audioFiles'}]
        }
      });

      const audioFile = entry.getFileCollection('audio_files').findWhere({perma_id: 6});

      expect(entry.fileReferences().placesFor(imageFile(entry, 5))[0].detail)
        .toEqual('Background image');
      expect(entry.fileReferences().placesFor(audioFile)[0].detail).toEqual('Atmo audio');
    });

    it('uses section pictogram for sections', () => {
      const entry = create({
        imageFiles: [{perma_id: 5}],
        sections: [{id: 1, permaId: 10, chapterId: 1,
                    configuration: {backdrop: {image: 5}}}],
        fileReferenceLocations: {
          sections: [{path: ['backdrop', 'image'], collection: 'imageFiles'}]
        }
      });

      expect(entry.fileReferences().placesFor(imageFile(entry, 5))[0].pictogram)
        .toEqual('sectionPictogram.svg');
    });

    it('lists content element referencing a file', () => {
      const entry = create({
        imageFiles: [{perma_id: 5}],
        sections: [{id: 1, permaId: 10, chapterId: 1}],
        contentElements: [{id: 2, permaId: 20, sectionId: 1, typeName: 'inlineImage',
                           configuration: {id: 5}}],
        fileReferenceLocations: {
          contentElements: {inlineImage: [{path: ['id'], collection: 'imageFiles'}]}
        }
      });

      expect(entry.fileReferences().placesFor(imageFile(entry, 5)).map(({label}) => label))
        .toEqual(['Intro - Image']);
    });

    it('uses pictogram of content element type', () => {
      editor.contentElementTypes.register('inlineImage', {pictogram: 'inlineImage.svg'});

      const entry = create({
        imageFiles: [{perma_id: 5}],
        sections: [{id: 1, permaId: 10, chapterId: 1}],
        contentElements: [{id: 2, permaId: 20, sectionId: 1, typeName: 'inlineImage',
                           configuration: {id: 5}}],
        fileReferenceLocations: {
          contentElements: {inlineImage: [{path: ['id'], collection: 'imageFiles'}]}
        }
      });

      expect(entry.fileReferences().placesFor(imageFile(entry, 5))[0].pictogram)
        .toEqual('inlineImage.svg');
    });

    it('names the referencing root property by the label of its input', () => {
      const entry = create({
        imageFiles: [{perma_id: 5}],
        sections: [{id: 1, permaId: 10, chapterId: 1}],
        contentElements: [{id: 2, permaId: 20, sectionId: 1, typeName: 'inlineImage',
                           configuration: {id: 5}}],
        fileReferenceLocations: {
          contentElements: {inlineImage: [{path: ['id'], collection: 'imageFiles'}]}
        }
      });

      expect(entry.fileReferences().placesFor(imageFile(entry, 5))[0].detail).toEqual('Image file');
    });

    it('omits detail for root property without input label', () => {
      const entry = create({
        imageFiles: [{perma_id: 5}],
        sections: [{id: 1, permaId: 10, chapterId: 1}],
        contentElements: [{id: 2, permaId: 20, sectionId: 1, typeName: 'inlineImage',
                           configuration: {thumbnail: 5}}],
        fileReferenceLocations: {
          contentElements: {inlineImage: [{path: ['thumbnail'], collection: 'imageFiles'}]}
        }
      });

      expect(entry.fileReferences().placesFor(imageFile(entry, 5))[0].detail).toBeUndefined();
    });

    it('omits detail for nested property', () => {
      const entry = create({
        imageFiles: [{perma_id: 5}],
        sections: [{id: 1, permaId: 10, chapterId: 1}],
        contentElements: [{id: 2, permaId: 20, sectionId: 1, typeName: 'inlineImage',
                           configuration: {areas: [{id: 5}]}}],
        fileReferenceLocations: {
          contentElements: {inlineImage: [{path: ['areas', '*', 'id'], collection: 'imageFiles'}]}
        }
      });

      expect(entry.fileReferences().placesFor(imageFile(entry, 5))[0].detail).toBeUndefined();
    });

    it('names the referencing property described by content element type', () => {
      editor.contentElementTypes.register('customElement', {
        configurationPlace(contentElement, path) {
          return {label: `Property ${path.join('.')}`};
        }
      });

      const entry = create({
        imageFiles: [{perma_id: 5}],
        sections: [{id: 1, permaId: 10, chapterId: 1}],
        contentElements: [{id: 2, permaId: 20, sectionId: 1, typeName: 'customElement',
                           configuration: {id: 5}}],
        fileReferenceLocations: {
          contentElements: {customElement: [{path: ['id'], collection: 'imageFiles'}]}
        }
      });

      expect(entry.fileReferences().placesFor(imageFile(entry, 5))
                  .map(({label, detail}) => [label, detail]))
        .toEqual([['Intro - Custom element', 'Property id']]);
    });

    it('lists a place per location referencing the file', () => {
      const entry = create({
        imageFiles: [{perma_id: 5}],
        sections: [{id: 1, permaId: 10, chapterId: 1,
                    configuration: {backdrop: {image: 5, imageMobile: 5}}}],
        fileReferenceLocations: {
          sections: [{path: ['backdrop', 'image'], collection: 'imageFiles'},
                     {path: ['backdrop', 'imageMobile'], collection: 'imageFiles'}]
        }
      });

      expect(entry.fileReferences().placesFor(imageFile(entry, 5)).map(({label}) => label))
        .toEqual(['Intro - Section 1', 'Intro - Section 1']);
    });

    it('lists entry metadata referencing a file', () => {
      const entry = create({
        metadata: {share_image_id: 5},
        imageFiles: [{perma_id: 5}],
        fileReferenceLocations: {
          entry: [{path: ['shareImageId'], collection: 'imageFiles'}]
        }
      });

      expect(entry.fileReferences().placesFor(imageFile(entry, 5))
                  .map(({label, detail, pictogram}) => [label, detail, pictogram]))
        .toEqual([['Settings', 'Social Sharing Image', 'settingsPictogram.svg']]);
    });

    it('skips inactive references', () => {
      const entry = create({
        imageFiles: [{perma_id: 5}],
        sections: [{id: 1, permaId: 10, chapterId: 1,
                    configuration: {backdrop: {image: 5, video: 6}}}],
        fileReferenceLocations: {
          sections: [{path: ['backdrop', 'image'], collection: 'imageFiles',
                      activeIf: {path: ['backdrop', 'video'], present: false}}]
        }
      });

      expect(entry.fileReferences().placesFor(imageFile(entry, 5))).toEqual([]);
    });

    it('ignores files of other collections', () => {
      const entry = create({
        imageFiles: [{perma_id: 5}],
        sections: [{id: 1, permaId: 10, chapterId: 1,
                    configuration: {backdrop: {video: 5}}}],
        fileReferenceLocations: {
          sections: [{path: ['backdrop', 'video'], collection: 'videoFiles'}]
        }
      });

      expect(entry.fileReferences().placesFor(imageFile(entry, 5))).toEqual([]);
    });

    it('lists places of parent file for nested files', () => {
      const entry = create({
        videoFiles: [{id: 100, perma_id: 5}],
        textTrackFiles: [{id: 200, perma_id: 6,
                          parent_file_id: 100,
                          parent_file_model_type: 'Pageflow::VideoFile'}],
        sections: [{id: 1, permaId: 10, chapterId: 1,
                    configuration: {backdrop: {video: 5}}}],
        fileReferenceLocations: {
          sections: [{path: ['backdrop', 'video'], collection: 'videoFiles'}]
        }
      });

      const textTrackFile = entry.getFileCollection('text_track_files').findWhere({perma_id: 6});

      expect(entry.fileReferences().placesFor(textTrackFile).map(({label}) => label))
        .toEqual(['Intro - Section 1']);
    });

    it('selects section settings on select', () => {
      const entry = create({
        imageFiles: [{perma_id: 5}],
        sections: [{id: 1, permaId: 10, chapterId: 1,
                    configuration: {backdrop: {image: 5}}}],
        fileReferenceLocations: {
          sections: [{path: ['backdrop', 'image'], collection: 'imageFiles'}]
        }
      });
      const listener = jest.fn();
      entry.on('selectSectionSettings', listener);

      entry.fileReferences().placesFor(imageFile(entry, 5))[0].select();

      expect(listener).toHaveBeenCalledWith(entry.sections.get(1));
    });

    it('scrolls to section on select', () => {
      const entry = create({
        imageFiles: [{perma_id: 5}],
        sections: [{id: 1, permaId: 10, chapterId: 1,
                    configuration: {backdrop: {image: 5}}}],
        fileReferenceLocations: {
          sections: [{path: ['backdrop', 'image'], collection: 'imageFiles'}]
        }
      });
      const listener = jest.fn();
      entry.on('scrollToSection', listener);

      entry.fileReferences().placesFor(imageFile(entry, 5))[0].select();

      expect(listener).toHaveBeenCalledWith(entry.sections.get(1), {ifNeeded: true});
    });

    it('scrolls to content element on select', () => {
      const entry = create({
        imageFiles: [{perma_id: 5}],
        sections: [{id: 1, permaId: 10, chapterId: 1}],
        contentElements: [{id: 2, permaId: 20, sectionId: 1, typeName: 'inlineImage',
                           configuration: {id: 5}}],
        fileReferenceLocations: {
          contentElements: {inlineImage: [{path: ['id'], collection: 'imageFiles'}]}
        }
      });
      const listener = jest.fn();
      entry.on('scrollToContentElement', listener);

      entry.fileReferences().placesFor(imageFile(entry, 5))[0].select();

      expect(listener).toHaveBeenCalledWith(entry.contentElements.get(2), {align: 'center'});
    });

    it('lets content element type select the described place', () => {
      const select = jest.fn();
      editor.contentElementTypes.register('customElement', {
        configurationPlace() {
          return {select};
        }
      });

      const entry = create({
        imageFiles: [{perma_id: 5}],
        sections: [{id: 1, permaId: 10, chapterId: 1}],
        contentElements: [{id: 2, permaId: 20, sectionId: 1, typeName: 'customElement',
                           configuration: {id: 5}}],
        fileReferenceLocations: {
          contentElements: {customElement: [{path: ['id'], collection: 'imageFiles'}]}
        }
      });

      entry.fileReferences().placesFor(imageFile(entry, 5))[0].select();

      expect(select).toHaveBeenCalled();
    });

    it('selects content element on select', () => {
      const entry = create({
        imageFiles: [{perma_id: 5}],
        sections: [{id: 1, permaId: 10, chapterId: 1}],
        contentElements: [{id: 2, permaId: 20, sectionId: 1, typeName: 'inlineImage',
                           configuration: {id: 5}}],
        fileReferenceLocations: {
          contentElements: {inlineImage: [{path: ['id'], collection: 'imageFiles'}]}
        }
      });
      const listener = jest.fn();
      entry.on('selectContentElement', listener);

      entry.fileReferences().placesFor(imageFile(entry, 5))[0].select();

      expect(listener).toHaveBeenCalledWith(entry.contentElements.get(2));
    });
  });
});
