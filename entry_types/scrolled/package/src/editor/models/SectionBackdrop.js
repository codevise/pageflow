import {Object} from 'pageflow/ui';

export const SectionBackdrop = Object.extend({
  initialize({configuration}) {
    this.configuration = configuration;

    this.listenTo(
      configuration,
      'change:backdropImageMotifArea change:backdropVideoMotifArea ' +
      'change:backdropImageMobileMotifArea change:backdropVideoMobileMotifArea',
      () => this.trigger('change:motifArea')
    );

    this.listenTo(
      configuration,
      'change:backdropType',
      () => this.trigger('change:type')
    );
  },

  getMotifAreaStatus({portrait} = {}) {
    const file = this.getFile({portrait});

    if (!file) {
      return null;
    }

    if (this.configuration.get(this.getMotifAreaPropertyName({portrait}))) {
      return 'defined';
    }

    if (file.configuration.get('ignoreMissingMotif')) {
      return 'ignored';
    }

    return 'missing';
  },

  getFile({portrait} = {}) {
    const backdropType = this.configuration.get('backdropType');

    if (backdropType === 'color') {
      return;
    }

    const propertyName = this.getFilePropertyName({portrait});
    const collection = backdropType === 'video' ? 'video_files' : 'image_files';
    return this.configuration.getReference(propertyName, collection);
  },

  getFilePropertyName({portrait} = {}) {
    const backdropType = this.configuration.get('backdropType');

    if (portrait) {
      return backdropType === 'video' ? 'backdropVideoMobile' : 'backdropImageMobile';
    }
    else {
      return backdropType === 'video' ? 'backdropVideo' : 'backdropImage';
    }
  },

  getMotifAreaPropertyName({portrait} = {}) {
    const backdropType = this.configuration.get('backdropType');

    if (portrait) {
      return backdropType === 'video' ? 'backdropVideoMobileMotifArea' : 'backdropImageMobileMotifArea';
    }
    else {
      return backdropType === 'video' ? 'backdropVideoMotifArea' : 'backdropImageMotifArea';
    }
  }
});
