import Cocktail from 'cocktail';
import Backbone from 'backbone';
import _ from 'underscore';

import {app} from '../app';

import {transientReferences} from './mixins/transientReferences';

import {state} from '$state';

export const Configuration = Backbone.Model.extend({
  modelName: 'page',
  i18nKey: 'pageflow/page',

  mixins: [transientReferences],

  defaults: {
    gradient_opacity: 100,
    display_in_navigation: true,
    transition: 'fade',
    text_position: 'left',
    invert: false,
    hide_title: false,
    autoplay: true
  },

  /**
   * Used by views (i.e. FileInputView) to get id which can be used in
   * routes to lookup configuration via its page.
   * @private
   */
  getRoutableId: function() {
    return this.parent.id;
  },

  getImageFileUrl: function(attribute, options) {
    options = options || {};

    var file = this.getImageFile(attribute);

    if (file && file.isReady()) {
      return file.get(options.styleGroup ? options.styleGroup + '_url' : 'url');
    }

    return '';
  },

  getImageFile: function(attribute) {
    return this.getReference(attribute, state.imageFiles);
  },

  getFilePosition: function(attribute, coord) {
    var propertyName = this.filePositionProperty(attribute, coord);
    return this.has(propertyName) ? this.get(propertyName) : 50;
  },

  setFilePosition: function(attribute, coord, value) {
    var propertyName = this.filePositionProperty(attribute, coord);
    this.set(propertyName, value);
  },

  setFilePositions: function(attribute, x, y) {
    var attributes = {};

    attributes[this.filePositionProperty(attribute, 'x')] = x;
    attributes[this.filePositionProperty(attribute, 'y')] = y;

    this.set(attributes);
  },

  filePositionProperty: function(attribute, coord) {
    return attribute.replace(/_id$/, '_' + coord);
  },

  getVideoFileSources: function(attribute) {
    var file = this.getVideoFile(attribute);

    if (file && file.isReady()) {
      return file.get('sources') ? this._appendSuffix(file.get('sources')) : '';
    }

    return '';
  },

  getVideoFile: function(attribute) {
    return this.getReference(attribute, state.videoFiles);
  },

  getAudioFileSources: function(attribute) {
    var file = this.getAudioFile(attribute);

    if (file && file.isReady()) {
      return file.get('sources') ? this._appendSuffix(file.get('sources')) : '';
    }

    return '';
  },

  getAudioFile: function(attribute) {
    return this.getReference(attribute, state.audioFiles);
  },

  getVideoPosterUrl: function() {
    var posterFile = this.getReference('poster_image_id', state.imageFiles),
        videoFile = this.getReference('video_file_id', state.videoFiles);

    if (posterFile) {
      return posterFile.get('url');
    }
    else if (videoFile) {
      return videoFile.get('poster_url');
    }

    return null;
  },

  _appendSuffix: function(sources) {
    var parent = this.parent;

    if (!parent || !parent.id) {
      return sources;
    }

    return _.map(sources, function(source) {
      var clone = _.clone(source);
      clone.src = clone.src + '?e=' + parent.id + '&t=' + new Date().getTime();
      return clone;
    });
  }
});

app.on('mixin:configuration', mixin => {
  Cocktail.mixin(Configuration, mixin);
});
