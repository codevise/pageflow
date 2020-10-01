import 'pageflow-scrolled/editor';
import {SectionConfiguration, FileSelectionHandler} from 'editor/models/SectionConfiguration';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories, setupGlobals} from 'pageflow/testHelpers';
import {useFakeXhr, normalizeSeed} from 'support';

describe('SectionConfiguration', () => {
  describe('get backdropType', () => {
    it('is color if image is legacy color', () => {
      const sectionConfiguration = new SectionConfiguration({backdrop: {image: '#000'}});

      expect(sectionConfiguration.get('backdropType')).toEqual('color');
    });

    it('is color if color is set in backdrop attribute', () => {
      const sectionConfiguration = new SectionConfiguration({backdrop: {color: '#000'}});

      expect(sectionConfiguration.get('backdropType')).toEqual('color');
    });

    it('is image if image is set in backdrop attribute', () => {
      const sectionConfiguration = new SectionConfiguration({backdrop: {image: 12}});

      expect(sectionConfiguration.get('backdropType')).toEqual('image');
    });

    it('is video if video is set in backdrop attribute', () => {
      const sectionConfiguration = new SectionConfiguration({backdrop: {video: 12}});

      expect(sectionConfiguration.get('backdropType')).toEqual('video');
    });

    it('uses stores value once set', () => {
      const sectionConfiguration = new SectionConfiguration({backdrop: {video: 12}});

      sectionConfiguration.set('backdropType', 'color')
      expect(sectionConfiguration.get('backdropType')).toEqual('color');
    });
  });

  describe('get backdropImage', () => {
    it('returns image id from backdrop attribute', () => {
      const sectionConfiguration = new SectionConfiguration({backdrop: {image: 12}});

      expect(sectionConfiguration.get('backdropImage')).toEqual(12);
    });

    it('returns undefined if image in backdrop attribute contains is legacy color ', () => {
      const sectionConfiguration = new SectionConfiguration({backdrop: {image: '#000'}});

      expect(sectionConfiguration.get('backdropImage')).toBeUndefined();
    });
  });

  describe('get backdropColor', () => {
    it('returns color from backdrop attribute', () => {
      const sectionConfiguration = new SectionConfiguration({backdrop: {color: '#000'}});

      expect(sectionConfiguration.get('backdropColor')).toEqual('#000');
    });

    it('returns legacy color from image in backdrop attribute ', () => {
      const sectionConfiguration = new SectionConfiguration({backdrop: {image: '#000'}});

      expect(sectionConfiguration.get('backdropColor')).toEqual('#000');
    });
  });

  describe('set backdropImage', () => {
    it('sets backdrop image to value', () => {
      const sectionConfiguration = new SectionConfiguration();

      sectionConfiguration.set('backdropType', 'image');
      sectionConfiguration.set('backdropImage', 1);

      expect(sectionConfiguration.attributes.backdrop).toEqual({
        image: 1
      });
    });

    it('does not override backdrop imageMobile if specified', () => {
      const sectionConfiguration = new SectionConfiguration();

      sectionConfiguration.set('backdropType', 'image');
      sectionConfiguration.set('backdropImageMobile', 2);
      sectionConfiguration.set('backdropImage', 1);

      expect(sectionConfiguration.attributes.backdrop).toEqual({
        image: 1,
        imageMobile: 2
      });
    });

    it('overrides backdrop video setting when setting backdrop image', () => {
      const sectionConfiguration = new SectionConfiguration();

      sectionConfiguration.set('backdropType', 'video');
      sectionConfiguration.set('backdropVideo', 1);
      sectionConfiguration.set('backdropType', 'image');
      sectionConfiguration.set('backdropImage', 1);

      expect(sectionConfiguration.attributes.backdrop).toEqual({
        image: 1
      });
    });
  });

  describe('set backdropImageMotifArea', () => {
    it('sets backdrop imageMotifArea to value', () => {
      const sectionConfiguration = new SectionConfiguration();
      const motifArea = {left: 1, top: 1, width: 10, height: 10};

      sectionConfiguration.set('backdropType', 'image');
      sectionConfiguration.set('backdropImage', 1);
      sectionConfiguration.set('backdropImageMotifArea', motifArea);

      expect(sectionConfiguration.attributes.backdrop).toEqual({
        image: 1,
        imageMotifArea: motifArea
      });
    });
  });

  describe('set backdropImageMobile', () => {
    it('sets backdrop imageMobile to value', () => {
      const sectionConfiguration = new SectionConfiguration();

      sectionConfiguration.set('backdropType', 'image');
      sectionConfiguration.set('backdropImageMobile', 1);

      expect(sectionConfiguration.attributes.backdrop).toEqual({
        imageMobile: 1
      });
    });

    it('does not override backdrop image if specified', () => {
      const sectionConfiguration = new SectionConfiguration();

      sectionConfiguration.set('backdropType', 'image');
      sectionConfiguration.set('backdropImage', 2);
      sectionConfiguration.set('backdropImageMobile', 1);

      expect(sectionConfiguration.attributes.backdrop).toEqual({
        image: 2,
        imageMobile: 1
      });
    });

    it('overrides backdrop video setting when setting backdrop ImageMobile', () => {
      const sectionConfiguration = new SectionConfiguration();

      sectionConfiguration.set('backdropType', 'video');
      sectionConfiguration.set('backdropVideo', 1);
      sectionConfiguration.set('backdropType', 'image');
      sectionConfiguration.set('backdropImageMobile', 1);

      expect(sectionConfiguration.attributes.backdrop).toEqual({
        imageMobile: 1
      });
    });

    it('resets legacy backdrop image color', () => {
      const sectionConfiguration = new SectionConfiguration({backdrop: {image: '#000'}});

      sectionConfiguration.set('backdropType', 'image');
      sectionConfiguration.set('backdropImageMobile', 1);

      expect(sectionConfiguration.attributes.backdrop).toEqual({
        imageMobile: 1
      });
    });
  });

  describe('set backdropImageMobileMotifArea', () => {
    it('sets backdrop imageMobileMotifArea to value', () => {
      const sectionConfiguration = new SectionConfiguration();
      const motifArea = {left: 1, top: 1, width: 10, height: 10};

      sectionConfiguration.set('backdropType', 'image');
      sectionConfiguration.set('backdropImageMobile', 1);
      sectionConfiguration.set('backdropImageMobileMotifArea', motifArea);

      expect(sectionConfiguration.attributes.backdrop).toEqual({
        imageMobile: 1,
        imageMobileMotifArea: motifArea
      });
    });
  });

  describe('set backdropVideo', () => {
    it('overrides backdrop image settings when setting backdrop video', () => {
      const sectionConfiguration = new SectionConfiguration();

      sectionConfiguration.set('backdropType', 'image');
      sectionConfiguration.set('backdropImage', 1);
      sectionConfiguration.set('backdropImageMobile', 2);
      sectionConfiguration.set('backdropType', 'video');
      sectionConfiguration.set('backdropVideo', 1);

      expect(sectionConfiguration.attributes.backdrop).toEqual({
        'video': 1
      });
    });
  });

  describe('set backdropVideoMotifArea', () => {
    it('sets backdrop videoMotifArea to value', () => {
      const sectionConfiguration = new SectionConfiguration();
      const motifArea = {left: 1, top: 1, width: 10, height: 10};

      sectionConfiguration.set('backdropType', 'video');
      sectionConfiguration.set('backdropVideo', 1);
      sectionConfiguration.set('backdropVideoMotifArea', motifArea);

      expect(sectionConfiguration.attributes.backdrop).toEqual({
        video: 1,
        videoMotifArea: motifArea
      });
    });
  });

  describe('set backdropColor', () => {
    it('overrides backdrop image settings when setting backdrop video', () => {
      const sectionConfiguration = new SectionConfiguration();

      sectionConfiguration.set('backdropType', 'image');
      sectionConfiguration.set('backdropImage', 1);
      sectionConfiguration.set('backdropImageMobile', 2);
      sectionConfiguration.set('backdropType', 'color');
      sectionConfiguration.set('backdropColor', '#000');

      expect(sectionConfiguration.attributes.backdrop).toEqual({
        color: '#000'
      });
    });
  });

  describe('set backdropType', () => {
    it('restores previous settings', () => {
      const sectionConfiguration = new SectionConfiguration();

      sectionConfiguration.set('backdropType', 'image');
      sectionConfiguration.set('backdropImage', 1);
      sectionConfiguration.set('backdropImageMobile', 2);
      sectionConfiguration.set('backdropType', 'color');
      sectionConfiguration.set('backdropColor', '#000');
      sectionConfiguration.set('backdropType', 'image');

      expect(sectionConfiguration.attributes.backdrop).toEqual({
        image: 1,
        imageMobile: 2
      });
    });

    it('restores previous motif area', () => {
      const sectionConfiguration = new SectionConfiguration();
      const motifAreaA = {left: 1, top: 1, width: 10, height: 10};
      const motifAreaB = {left: 2, top: 2, width: 20, height: 0};

      sectionConfiguration.set('backdropType', 'image');
      sectionConfiguration.set('backdropImage', 1);
      sectionConfiguration.set('backdropImageMotifArea', motifAreaA);
      sectionConfiguration.set('backdropType', 'video');
      sectionConfiguration.set('backdropVideo', 2);
      sectionConfiguration.set('backdropVideoMotifArea', motifAreaB);
      sectionConfiguration.set('backdropType', 'image');

      expect(sectionConfiguration.attributes.backdrop).toEqual({
        image: 1,
        imageMotifArea: motifAreaA
      });
    });
  });

  describe('FileSelectionHandler', () => {
    let testContext;

    beforeEach(() => {
      const entry = factories.entry(ScrolledEntry, {}, {
        fileTypes: factories.fileTypesWithImageFileType(),
        filesAttributes: {
          image_files: [
            {
              id: 1,
              configuration: {
                motifArea: {left: 10, top: 20, width: 50, height: 40}
              }
            },
            {
              id: 2
            }
          ]
        },
        entryTypeSeed: normalizeSeed({
          sections: [
            {
              id: 10,
              configuration: {backdropType: 'image'}
            }
          ]
        })
      });

      testContext = {
        entry,
        imageFileWithMotifArea: entry.getFileCollection('image_files').get(1),
        imageFileWithoutMotifArea: entry.getFileCollection('image_files').get(2),
        section: entry.sections.first()
      };
    });

    setupGlobals({
      entry: () => testContext.entry
    });

    useFakeXhr(() => testContext);

    it('copies default motif area from file to section configuration', () => {
      const fileSelectionHandler = new FileSelectionHandler({
        entry: testContext.entry,
        id: 10,
        attributeName: 'backdropImage'
      });
      fileSelectionHandler.call(testContext.imageFileWithMotifArea);

      expect(testContext.section.configuration.get('backdrop').imageMotifArea).toEqual({
        left: 10, top: 20, width: 50, height: 40
      });
    });

    it('resets motif area from in section configuration when file changes', () => {
      const fileSelectionHandler = new FileSelectionHandler({
        entry: testContext.entry,
        id: 10,
        attributeName: 'backdropImage'
      });
      fileSelectionHandler.call(testContext.imageFileWithMotifArea);
      fileSelectionHandler.call(testContext.imageFileWithoutMotifArea);

      expect(testContext.section.configuration.get('backdrop').imageMotifArea).toBeUndefined();
    });
  });
});
