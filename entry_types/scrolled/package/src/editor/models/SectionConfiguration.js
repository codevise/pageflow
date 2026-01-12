import {editor, Configuration} from 'pageflow/editor';

import {SectionBackdrop} from './SectionBackdrop';

export const SectionConfiguration = Configuration.extend({
  defaults: {
    transition: 'fadeBg',
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
    let attrs;

    if (typeof name === 'object') {
      attrs = name;
    }
    else {
      attrs = {[name]: value};
    }

    if (!attrs.backdrop && Object.keys(attrs).some(key => key.startsWith('backdrop'))) {
      Configuration.prototype.set.call(this, {
        backdrop: this.getBackdropAttribute({
          ...this.attributes,
          ...attrs
        }),
        ...attrs
      });
    }
    else {
      Configuration.prototype.set.apply(this, arguments);
    }

    if (attrs.backdropType) {
      const backdropContentElement = this.parent?.getBackdropContentElement();

      if (backdropContentElement) {
        backdropContentElement.configuration.set(
          'position',
          attrs.backdropType === 'contentElement' ? 'backdrop' : 'inline'
        );
      }
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
        videoMotifArea: nextAttributes.backdropVideoMotifArea,
        videoInlineRightsHidden: nextAttributes.backdropVideoInlineRightsHidden,
        videoMobile: nextAttributes.backdropVideoMobile,
        videoMobileMotifArea: nextAttributes.backdropVideoMobileMotifArea,
        videoMobileInlineRightsHidden: nextAttributes.backdropVideoMobileInlineRightsHidden
      };
    case 'contentElement':
      return {
        contentElement: nextAttributes.backdropContentElement
      };
    default:
      return {
        image: nextAttributes.backdropImage,
        imageMotifArea: nextAttributes.backdropImageMotifArea,
        imageInlineRightsHidden: nextAttributes.backdropImageInlineRightsHidden,
        imageMobile: nextAttributes.backdropImageMobile,
        imageMobileMotifArea: nextAttributes.backdropImageMobileMotifArea,
        imageMobileInlineRightsHidden: nextAttributes.backdropImageMobileInlineRightsHidden
      };
    }
  },

  getBackdrop() {
    this._backdrop = this._backdrop || new SectionBackdrop({configuration: this});
    return this._backdrop;
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
