import Marionette from 'backbone.marionette';

import {CollectionView} from 'pageflow/ui';

import {editor} from '../base';

import {FileListing} from '../models/FileListing';
import {ExplorerFileItemView} from './ExplorerFileItemView';
import {FileTypePillsView} from './FileTypePillsView';
import {LoadingView} from './LoadingView';

import template from '../templates/explorerFiles.jst';
import blankSlateTemplate from '../templates/explorerFilesBlankSlate.jst';

export const ExplorerFilesView = Marionette.ItemView.extend({
  template,
  className: 'explorer_files',

  ui: {
    pills: '.explorer_files-pills',
    gallery: '.explorer_files-gallery'
  },

  initialize: function() {
    this.fileTypes = editor.fileTypes.filter(function(fileType) {
      return fileType.topLevelType;
    });

    this.fileListing = new FileListing({}, {
      collections: this.fileTypes.map(function(fileType) {
        return this.options.entry.getFileCollection(fileType);
      }, this),
      fileTypeSelection: this.options.fileTypeSelection,
      ignoreAbsentFileTypes: true
    });

    this.loading = true;
    this.options.entry.fetchFiles().always(() => {
      this.loading = false;
      this.fileListing.updateFileTypeFilter();

      if (this.galleryView && !this.isClosed) {
        this.renderGallery();
      }
    });
  },

  onRender: function() {
    this.appendSubview(new FileTypePillsView({
      entry: this.options.entry,
      fileTypes: this.fileTypes,
      fileTypeSelection: this.options.fileTypeSelection
    }), {to: this.ui.pills});

    this.renderGallery();
  },

  renderGallery: function() {
    if (this.galleryView) {
      this.galleryView.close();
    }

    this.galleryView = this.subview(this.loading ? new LoadingGalleryView() : new CollectionView({
      tagName: 'ul',
      className: 'files_gallery',
      collection: this.fileListing.listItems,
      itemViewConstructor: ExplorerFileItemView,
      itemViewOptions: {
        selection: this.options.selection,
        currentEntry: this.options.currentEntry
      },
      blankSlateViewConstructor: Marionette.ItemView.extend({
        template: blankSlateTemplate,
        tagName: 'li',
        className: 'blank_slate'
      })
    }));

    this.ui.gallery.append(this.galleryView.el);
  },

  onClose: function() {
    Marionette.ItemView.prototype.onClose.call(this);
    this.fileListing.dispose();
  }
});

const LoadingGalleryView = Marionette.View.extend({
  tagName: 'ul',
  className: 'files_gallery',

  render: function() {
    this.appendSubview(new LoadingView());
    return this;
  }
});
