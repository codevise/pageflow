import {SectionConfiguration} from 'editor/models/SectionConfiguration';

describe('SectionConfiguration', () => {
  describe('set backdropImage', () => {
    it('sets backdrop image to value and backdrop imageMobile to default if not specified', () => {
      const sectionConfiguration = new SectionConfiguration();
      sectionConfiguration.set('backdropImage', 1);
      expect(sectionConfiguration.attributes.backdrop).toEqual({
        'image': 1,
        'imageMobile': '#fff'
      });
    });

    it('does not override backdrop imageMobile if specified', () => {
      const sectionConfiguration = new SectionConfiguration();
      sectionConfiguration.set('backdropImageMobile', 2);
      sectionConfiguration.set('backdropImage', 1);
      expect(sectionConfiguration.attributes.backdrop).toEqual({
        'image': 1,
        'imageMobile': 2
      });
    });

    it('overrides backdrop video setting when setting backdrop image', () => {
      const sectionConfiguration = new SectionConfiguration();
      sectionConfiguration.set('backdropVideo', 1);
      sectionConfiguration.set('backdropImage', 1);
      expect(sectionConfiguration.attributes.backdrop).toEqual({
        'image': 1,
        'imageMobile': '#fff'
      });
    });
  })

  describe('set backdropImageMobile', () => {
    it('sets backdrop imageMobile to value and image to default if not specified', () => {
      const sectionConfiguration = new SectionConfiguration();
      sectionConfiguration.set('backdropImageMobile', 1);
      expect(sectionConfiguration.attributes.backdrop).toEqual({
        'image': '#fff',
        'imageMobile': 1
      });
    });

    it('does not override backdrop image if specified', () => {
      const sectionConfiguration = new SectionConfiguration();
      sectionConfiguration.set('backdropImage', 2);
      sectionConfiguration.set('backdropImageMobile', 1);
      expect(sectionConfiguration.attributes.backdrop).toEqual({
        'image': 2,
        'imageMobile': 1
      });
    });

    it('overrides backdrop video setting when setting backdrop ImageMobile', () => {
      const sectionConfiguration = new SectionConfiguration();
      sectionConfiguration.set('backdropVideo', 1);
      sectionConfiguration.set('backdropImageMobile', 1);
      expect(sectionConfiguration.attributes.backdrop).toEqual({
        'image': '#fff',
        'imageMobile': 1
      });
    });
  })

  describe('set backdropVideo', () => {
    it('overrides backdrop image settings when setting backdrop video', () => {
      const sectionConfiguration = new SectionConfiguration();
      sectionConfiguration.set('backdropImage', 1);
      sectionConfiguration.set('backdropImageMobile', 2);
      sectionConfiguration.set('backdropVideo', 1);
      expect(sectionConfiguration.attributes.backdrop).toEqual({
        'video': 1
      });
    });
  })
});
