import 'pageflow-scrolled/editor';

import {useEditorGlobals, useFakeXhr} from 'support';

describe('SectionBackdrop', () => {
  const {createEntry} = useEditorGlobals();

  useFakeXhr();

  describe('getMotifAreaStatus', () => {
    it('returns null when no file is present', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {}}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();

      expect(backdrop.getMotifAreaStatus()).toBeNull();
    });

    it('returns null when backdropType is color', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color', backdropColor: '#000'}}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();

      expect(backdrop.getMotifAreaStatus()).toBeNull();
    });

    it('returns defined when motif area is set', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {
          backdropImage: 10,
          backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50}
        }}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();

      expect(backdrop.getMotifAreaStatus()).toEqual('defined');
    });

    it('returns missing when file is present but no motif area', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();

      expect(backdrop.getMotifAreaStatus()).toEqual('missing');
    });

    it('returns ignored when file has ignoreMissingMotif flag', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });
      const file = entry.getFileCollection('image_files').get(100);
      file.configuration.set('ignoreMissingMotif', true);
      const backdrop = entry.sections.get(1).configuration.getBackdrop();

      expect(backdrop.getMotifAreaStatus()).toEqual('ignored');
    });

    it('returns defined for portrait when portrait motif area is set', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}, {id: 101, perma_id: 11}],
        sections: [{id: 1, configuration: {
          backdropImage: 10,
          backdropImageMobile: 11,
          backdropImageMobileMotifArea: {left: 0, top: 0, width: 50, height: 50}
        }}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();

      expect(backdrop.getMotifAreaStatus({portrait: true})).toEqual('defined');
      expect(backdrop.getMotifAreaStatus({portrait: false})).toEqual('missing');
    });

    it('works with video backdrop', () => {
      const entry = createEntry({
        videoFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {
          backdropType: 'video',
          backdropVideo: 10,
          backdropVideoMotifArea: {left: 0, top: 0, width: 50, height: 50}
        }}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();

      expect(backdrop.getMotifAreaStatus()).toEqual('defined');
    });
  });

  describe('getFile', () => {
    it('returns undefined when no file is set', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {}}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();

      expect(backdrop.getFile()).toBeUndefined();
    });

    it('returns undefined for color backdrop', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color'}}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();

      expect(backdrop.getFile()).toBeUndefined();
    });

    it('returns image file for image backdrop', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();

      expect(backdrop.getFile().id).toEqual(100);
    });

    it('returns video file for video backdrop', () => {
      const entry = createEntry({
        videoFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropType: 'video', backdropVideo: 10}}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();

      expect(backdrop.getFile().id).toEqual(100);
    });

    it('returns portrait file when portrait option is true', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}, {id: 101, perma_id: 11}],
        sections: [{id: 1, configuration: {backdropImage: 10, backdropImageMobile: 11}}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();

      expect(backdrop.getFile({portrait: false}).id).toEqual(100);
      expect(backdrop.getFile({portrait: true}).id).toEqual(101);
    });
  });

  describe('getFilePropertyName', () => {
    it('returns backdropImage for image backdrop', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'image'}}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();

      expect(backdrop.getFilePropertyName()).toEqual('backdropImage');
    });

    it('returns backdropImageMobile for portrait image backdrop', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'image'}}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();

      expect(backdrop.getFilePropertyName({portrait: true})).toEqual('backdropImageMobile');
    });

    it('returns backdropVideo for video backdrop', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'video'}}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();

      expect(backdrop.getFilePropertyName()).toEqual('backdropVideo');
    });

    it('returns backdropVideoMobile for portrait video backdrop', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'video'}}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();

      expect(backdrop.getFilePropertyName({portrait: true})).toEqual('backdropVideoMobile');
    });
  });

  describe('change:type event', () => {
    it('is triggered when backdropType changes', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {}}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();
      const listener = jest.fn();

      backdrop.on('change:type', listener);
      entry.sections.get(1).configuration.set('backdropType', 'video');

      expect(listener).toHaveBeenCalled();
    });
  });

  describe('change:motifArea event', () => {
    it('is triggered when backdropImageMotifArea changes', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {}}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();
      const listener = jest.fn();

      backdrop.on('change:motifArea', listener);
      entry.sections.get(1).configuration.set('backdropImageMotifArea', {left: 0, top: 0, width: 50, height: 50});

      expect(listener).toHaveBeenCalled();
    });

    it('is triggered when backdropVideoMotifArea changes', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {}}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();
      const listener = jest.fn();

      backdrop.on('change:motifArea', listener);
      entry.sections.get(1).configuration.set('backdropVideoMotifArea', {left: 0, top: 0, width: 50, height: 50});

      expect(listener).toHaveBeenCalled();
    });

    it('is triggered when backdropImageMobileMotifArea changes', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {}}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();
      const listener = jest.fn();

      backdrop.on('change:motifArea', listener);
      entry.sections.get(1).configuration.set('backdropImageMobileMotifArea', {left: 0, top: 0, width: 50, height: 50});

      expect(listener).toHaveBeenCalled();
    });

    it('is triggered when backdropVideoMobileMotifArea changes', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {}}]
      });
      const backdrop = entry.sections.get(1).configuration.getBackdrop();
      const listener = jest.fn();

      backdrop.on('change:motifArea', listener);
      entry.sections.get(1).configuration.set('backdropVideoMobileMotifArea', {left: 0, top: 0, width: 50, height: 50});

      expect(listener).toHaveBeenCalled();
    });
  });
});
