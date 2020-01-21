import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {CollectionView} from 'pageflow/ui';

import {editor} from '../base';

import {FileMetaDataItemView} from './FileMetaDataItemView';
import {FileSettingsDialogView} from './FileSettingsDialogView';
import {FileStageItemView} from './FileStageItemView';
import {FileThumbnailView} from './FileThumbnailView';
import {TextFileMetaDataItemValueView} from './TextFileMetaDataItemValueView';
import {loadable} from './mixins/loadable';

import template from '../templates/fileItem.jst';

export const FileItemView = Marionette.ItemView.extend({
  tagName: 'li',
  template,

  mixins: [loadable],

  ui: {
    fileName: '.file_name',

    selectButton: '.select',
    settingsButton: '.settings',
    removeButton: '.remove',
    confirmButton: '.confirm',
    cancelButton: '.cancel',
    retryButton: '.retry',

    thumbnail: '.file_thumbnail',
    stageItems: '.file_stage_items',

    metaData: 'tbody.attributes',
    downloads: 'tbody.downloads',
    downloadLink: 'a.original'
  },

  events: {
    'click .select': function() {
      var result = this.options.selectionHandler.call(this.model);

      if (result !== false) {
        editor.navigate(this.options.selectionHandler.getReferer(),
                                 {trigger: true});
      }

      return false;
    },

    'click .settings': function() {
      FileSettingsDialogView.open({
        model: this.model
      });
    },

    'click .cancel': 'cancel',

    'click .confirm': 'confirm',

    'click .remove': 'destroy',

    'click .retry': 'retry',

    'click .file_thumbnail': 'toggleExpanded'
  },

  modelEvents: {
    'change': 'update'
  },

  onRender: function() {
    this.update();

    this.subview(new FileThumbnailView({
      el: this.ui.thumbnail,
      model: this.model
    }));

    this.subview(new CollectionView({
      el: this.ui.stageItems,
      collection: this.model.stages,
      itemViewConstructor: FileStageItemView
    }));

    _.each(this.metaDataViews(), function(view) {
      this.ui.metaData.append(this.subview(view).el);
    }, this);
  },

  update: function() {
    if (this.isClosed) {
      return;
    }

    this.$el.attr('data-id', this.model.id);
    this.ui.fileName.text(this.model.get('file_name') || '(Unbekannt)');

    this.ui.downloadLink.attr('href', this.model.get('original_url'));
    this.ui.downloads.toggle(this.model.isUploaded() && !_.isEmpty(this.model.get('original_url')));

    this.ui.selectButton.toggle(!!this.options.selectionHandler);
    this.ui.settingsButton.toggle(!this.model.isNew());

    this.ui.cancelButton.toggle(this.model.isUploading());
    this.ui.confirmButton.toggle(this.model.isConfirmable());
    this.ui.removeButton.toggle(!this.model.isUploading());
    this.ui.retryButton.toggle(this.model.isRetryable());

    this.updateToggleTitle();
  },

  metaDataViews: function() {
    var model = this.model;

    return _.map(this.options.metaDataAttributes, function(options) {
      if (typeof options === 'string') {
        options = {
          name: options,
          valueView: TextFileMetaDataItemValueView
        };
      }

      return new FileMetaDataItemView(_.extend({
        model: model
      }, options));
    });
  },

  toggleExpanded: function() {
    this.$el.toggleClass('expanded');
    this.updateToggleTitle();
  },

  updateToggleTitle: function() {
    this.ui.thumbnail.attr('title', this.$el.hasClass('expanded') ? 'Details ausblenden' : 'Details einblenden');
  },

  destroy: function() {
    if (confirm("Datei wirklich wirklich löschen?")) {
      this.model.destroy();
    }
  },

  cancel: function() {
    this.model.cancelUpload();
  },

  confirm: function() {
    editor.navigate('/confirmable_files?type=' + this.model.modelName + '&id=' + this.model.id, {trigger: true});
  },

  retry: function() {
    this.model.retry();
  }
});
