import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {CollectionView} from 'pageflow/ui';

import {FileMetaDataItemView} from './FileMetaDataItemView';
import {FileStageItemView} from './FileStageItemView';
import {TextFileMetaDataItemValueView} from './TextFileMetaDataItemValueView';

import template from '../templates/fileDetails.jst';

export const FileDetailsView = Marionette.ItemView.extend({
  template,
  className: 'file_details',

  ui: {
    preview: '.file_details-preview',
    stageItems: '.file_stage_items',
    metaData: 'tbody.attributes',
    downloads: 'tbody.downloads',
    downloadLink: 'a.original'
  },

  modelEvents: {
    'change': 'update',
    'change:state': 'renderPreview'
  },

  onRender: function() {
    this.update();
    this.ui.preview.hide();

    this.subview(new CollectionView({
      el: this.ui.stageItems,
      collection: this.model.currentStages,
      itemViewConstructor: FileStageItemView
    }));

    this.listenTo(this.model.currentStages, 'add remove', this.updateStages);
    this.updateStages();

    _.each(this.metaDataViews(), function(view) {
      this.ui.metaData.append(this.subview(view).el);
    }, this);
  },

  // Videos of files whose details are not on screen would otherwise
  // keep loading and playing in the background.
  showPreview: function() {
    this.previewShown = true;
    this.renderPreview();
  },

  hidePreview: function() {
    this.previewShown = false;
    this.closePreview();
  },

  // Files only get a preview once they have finished processing.
  renderPreview: function() {
    this.closePreview();

    if (this.isClosed || !this.previewShown) {
      return;
    }

    this.previewView = this.model.createPreviewView();

    if (this.previewView) {
      this.ui.preview.append(this.previewView.render().el);
    }

    this.ui.preview.toggle(!!this.previewView);
  },

  closePreview: function() {
    if (this.previewView) {
      this.previewView.close();
      this.previewView = null;
    }

    if (!this.isClosed) {
      this.ui.preview.hide();
    }
  },

  update: function() {
    if (this.isClosed) {
      return;
    }

    this.ui.downloadLink.attr('href', this.model.get('download_url'));
    this.ui.downloads.toggle(this.model.isUploaded() &&
                             !_.isEmpty(this.model.get('download_url')));
  },

  // The separator would otherwise linger once the file is done.
  updateStages: function() {
    this.ui.stageItems.toggle(!!this.model.currentStages.length);
  },

  metaDataViews: function() {
    var model = this.model;
    var readOnly = this.options.readOnly;

    return _.map(this.options.metaDataAttributes, function(options) {
      if (typeof options === 'string') {
        options = {
          name: options,
          valueView: TextFileMetaDataItemValueView
        };
      }

      return new FileMetaDataItemView(_.extend({
        model: model,
        readOnly: readOnly
      }, options));
    });
  },

  onClose: function() {
    Marionette.ItemView.prototype.onClose.call(this);
    this.closePreview();
  }
});
