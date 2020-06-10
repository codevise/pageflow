import {editor, Configuration} from 'pageflow/editor';

export const SectionConfiguration = Configuration.extend({
  defaults: {
    transition: 'scroll',
    fullHeight: true,
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
        video: this.get('backdropVideo')
      });
    default:
      return this.set('backdrop', {
        image: this.get('backdropImage'),
        imageMobile: this.get('backdropImageMobile')
      });
    }
  }
});

export const FileSelectionHandler = function(options) {
  const contentElement = options.entry.sections.get(options.id);

  this.call = function(file) {
    contentElement.configuration.setReference(options.attributeName, file);
  };

  this.getReferer = function() {
    return '/scrolled/sections/' + contentElement.id;
  };
};

editor.registerFileSelectionHandler('sectionConfiguration', FileSelectionHandler);
