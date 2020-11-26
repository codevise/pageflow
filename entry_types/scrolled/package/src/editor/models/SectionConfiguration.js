import {editor, Configuration} from 'pageflow/editor';

export const SectionConfiguration = Configuration.extend({
  defaults: {
    transition: 'scroll',
    fullHeight: true,
    exposeMotifArea: true,
    backdrop: {
    }
  },

  initialize() {
    Configuration.prototype.initialize.apply(this, arguments);

    this.attributes = {
      ...this.getBackdropAttributes(),
      ...this.attributes
    }
  },

  getBackdropAttributes() {
    const backdrop = this.attributes.backdrop || {};

    if (backdrop.image && backdrop.image.toString().startsWith('#')) {
      return {
        backdropType: 'color',
        backdropColor: backdrop.image
      };
    }
    else if (backdrop.color) {
      return {
        backdropType: 'color',
        backdropColor: backdrop.color
      };
    }
    else if (backdrop.video) {
      return {
        backdropType: 'video',
        backdropVideo: backdrop.video
      };
    }
    else {
      return {
        backdropType: 'image',
        backdropImage: backdrop.image,
        backdropImageMobile: backdrop.imageMobile
      };
    }
  },

  set: function(name, value) {
    Configuration.prototype.set.apply(this, arguments);

    if (name !== 'backdrop' &&
        name.startsWith &&
        name.startsWith('backdrop')) {
      this.updateBackdropAttribute();
    }
  },

  updateBackdropAttribute() {
    switch (this.get('backdropType')) {
    case 'color':
      return this.set('backdrop', {
        color: this.get('backdropColor')
      });
    case 'video':
      return this.set('backdrop', {
        video: this.get('backdropVideo'),
        videoMotifArea: this.get('backdropVideoMotifArea')
      });
    default:
      return this.set('backdrop', {
        image: this.get('backdropImage'),
        imageMotifArea: this.get('backdropImageMotifArea'),
        imageMobile: this.get('backdropImageMobile'),
        imageMobileMotifArea: this.get('backdropImageMobileMotifArea')
      });
    }
  }
});

export const FileSelectionHandler = function(options) {
  const section = options.entry.sections.get(options.id);

  this.call = function(file) {
    section.configuration.setReference(options.attributeName, file);
    section.configuration.set(`${options.attributeName}MotifArea`,
                              file.configuration.get('motifArea'));
  };

  this.getReferer = function() {
    return '/scrolled/sections/' + section.id;
  };
};

editor.registerFileSelectionHandler('sectionConfiguration', FileSelectionHandler);
