import {editor, Configuration} from 'pageflow/editor';

export const SectionConfiguration = Configuration.extend({
  defaults: {
    transition: 'scroll',
    backdrop: {
      image: '#fff',
      imageMobile: '#fff'
    }
  },

  get: function(name) {
    if (name === 'backdropImage') {
      return this.attributes.backdrop &&
             this.attributes.backdrop.image;
    }
    if (name === 'backdropImageMobile') {
      return this.attributes.backdrop &&
             this.attributes.backdrop.imageMobile;
    }
    if (name === 'backdropType') {
      return Configuration.prototype.get.apply(this, arguments) ||
             (this.attributes.backdrop &&
              this.attributes.backdrop.image &&
              this.attributes.backdrop.image.toString().startsWith('#') ? 'color' : 'image');
    }
    if (name === 'backdropVideo') {
      return this.attributes.backdrop &&
        this.attributes.backdrop.video;
    }
    return Configuration.prototype.get.apply(this, arguments);
  },

  set: function(name, value) {
    if (name === 'backdropImage' && value) {
      this.set('backdrop', {
        image: value,
        imageMobile: this.attributes.backdrop.imageMobile ||
                     this.defaults.backdrop.imageMobile
      });
    }
    if (name === 'backdropImageMobile' && value) {
      this.set('backdrop', {
        imageMobile: value,
        image: this.attributes.backdrop.image ||
               this.defaults.backdrop.image
      });
    }
    if (name === 'backdropVideo' && value) {
      this.set('backdrop', {video: value});
    }
    return Configuration.prototype.set.apply(this, arguments);
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
