import {editor, Configuration} from 'pageflow/editor';

export const SectionConfiguration = Configuration.extend({
  defaults: {
    transition: 'fade',
    fullHeight: true,
    exposeMotifArea: true,
    backdrop: {
    }
  },

  initialize() {
    Configuration.prototype.initialize.apply(this, arguments);

    this.attributes = {
      ...this.getAttributesFromBackdropAttribute(),
      ...this.attributes
    }
  },

  getAttributesFromBackdropAttribute() {
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
    if (name !== 'backdrop' && name.startsWith && name.startsWith('backdrop')) {
      Configuration.prototype.set.call(this, {
        backdrop: this.getBackdropAttribute({
          ...this.attributes,
          [name]: value
        }),
        [name]: value
      });
    }
    else {
      Configuration.prototype.set.apply(this, arguments);
    }
  },

  getBackdropAttribute(nextAttributes) {
    switch (nextAttributes.backdropType) {
    case 'color':
      return {
        color: nextAttributes.backdropColor
      };
    case 'video':
      return {
        video: nextAttributes.backdropVideo,
        videoMotifArea: nextAttributes.backdropVideoMotifArea
      };
    default:
      return {
        image: nextAttributes.backdropImage,
        imageMotifArea: nextAttributes.backdropImageMotifArea,
        imageMobile: nextAttributes.backdropImageMobile,
        imageMobileMotifArea: nextAttributes.backdropImageMobileMotifArea
      };
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
