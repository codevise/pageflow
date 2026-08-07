import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import _ from 'underscore';
import I18n from 'i18n-js';

import {CollectionView} from 'pageflow/ui';

import {editor} from '../base';

import {DropDownButtonView} from './DropDownButtonView';
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

    actions: '.actions',
    selectButton: '.select',
    settingsButton: '.settings',
    confirmButton: '.confirm',
    retryButton: '.retry',

    thumbnail: '.file_thumbnail',
    thumbnailButton: '.file_thumbnail_button',
    stageItems: '.file_stage_items',
    details: '.details',

    metaData: 'tbody.attributes',
    downloads: 'tbody.downloads',
    downloadLink: 'a.original'
  },

  events: {
    'click .select': 'select',

    'click .settings': function() {
      FileSettingsDialogView.open({
        model: this.model
      });
    },

    'click .confirm': 'confirm',

    'click .retry': 'retry',

    'click .file_thumbnail_button': 'toggleExpanded'
  },

  initialize: function() {
    this.menuItems = this.createMenuItems();

    if (this.options.listHighlight) {
      this.listenTo(this.options.listHighlight, 'change:currentCid change:active', () => {
        if (this.updateHighlight()) {
          this.el.scrollIntoView({block: 'nearest', behavior: 'smooth'});
        }
      });

      this.listenTo(this.options.listHighlight, 'selected:' + this.model.cid, this.select);
    }
  },

  createMenuItems: function() {
    var items = new Backbone.Collection([
      {
        name: 'cancel',
        label: I18n.t('pageflow.editor.templates.file_item.cancel_upload')
      },
      {
        name: 'destroy',
        label: I18n.t('pageflow.editor.templates.file_item.destroy'),
        destructive: true
      }
    ]);

    items.findWhere({name: 'cancel'}).selected = () => this.cancel();
    items.findWhere({name: 'destroy'}).selected = () => this.destroy();

    return items;
  },

  menuItem: function(name) {
    return this.menuItems.findWhere({name: name});
  },

  modelEvents: {
    'change': 'update'
  },

  serializeData: function() {
    return {selectable: !!this.options.selectionHandler};
  },

  onRender: function() {
    this.$el.toggleClass('selectable', !!this.options.selectionHandler);

    this.update();
    this.setupAriaAttributes();

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

    this.renderActionsDropDown();
    this.updateHighlight();
  },

  // Selecting a file is the only action offered in selection mode.
  renderActionsDropDown: function() {
    if (this.options.selectionHandler) {
      return;
    }

    this.ui.actions.append(this.subview(new DropDownButtonView({
      items: this.menuItems,
      title: I18n.t('pageflow.editor.templates.file_item.actions'),
      alignMenu: 'right',
      ellipsisIcon: true,
      borderless: true,
      openOnClick: true
    })).el);
  },

  update: function() {
    if (this.isClosed) {
      return;
    }

    this.$el.attr('data-id', this.model.id);
    this.ui.fileName.text(this.model.title());

    this.ui.downloadLink.attr('href', this.model.get('download_url'));
    this.ui.downloads.toggle(this.model.isUploaded() && !_.isEmpty(this.model.get('download_url')));

    this.ui.settingsButton.toggle(!this.model.isNew());

    this.menuItem('cancel').set('hidden', !this.model.isUploading());
    this.menuItem('destroy').set('hidden', this.model.isUploading());

    this.ui.confirmButton.toggle(this.model.isConfirmable());
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

  setupAriaAttributes: function() {
    var detailsId = 'file-details-' + this.model.cid;
    var fileNameId = 'file-name-' + this.model.cid;
    var selectId = 'file-select-' + this.model.cid;

    this.ui.thumbnailButton.attr('aria-controls', detailsId);
    this.ui.details.attr('id', detailsId);

    // The select button covers the whole row, so its label has to name
    // the file it selects.
    this.ui.fileName.attr('id', fileNameId);
    this.ui.selectButton.attr('id', selectId);
    this.ui.selectButton.attr('aria-labelledby', selectId + ' ' + fileNameId);
  },

  updateToggleTitle: function() {
    var isExpanded = this.$el.hasClass('expanded');
    var titleText = I18n.t(isExpanded ?
                           'pageflow.editor.templates.file_item.collapse_details' :
                           'pageflow.editor.templates.file_item.expand_details');

    this.ui.thumbnailButton.attr('aria-expanded', isExpanded.toString());
    this.ui.thumbnailButton.attr('title', titleText);
    this.ui.thumbnailButton.attr('aria-label', titleText);
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
  },

  select: function() {
    var result = this.options.selectionHandler.call(this.model);

    if (result !== false) {
      editor.navigate(this.options.selectionHandler.getReferer(), {trigger: true});
    }

    return false;
  },

  updateHighlight: function() {
    if (!this.options.listHighlight) {
      return false;
    }

    var highlighted = this.options.listHighlight.get('currentCid') === this.model.cid &&
                      this.options.listHighlight.get('active');

    this.$el.toggleClass('keyboard_highlight', highlighted);
    this.$el.attr('aria-selected', highlighted ? 'true' : null);

    return highlighted;
  }
});
