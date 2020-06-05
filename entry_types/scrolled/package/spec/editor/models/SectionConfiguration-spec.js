import {SectionConfiguration} from 'editor/models/SectionConfiguration';

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
  });
});
