import $ from 'jquery';
import Marionette from 'backbone.marionette';

import {CollectionView} from 'pageflow/ui';

import {editor} from '../base';

import {FileFolder} from '../models/FileFolder';
import {FileListing} from '../models/FileListing';
import {ExplorerFileItemView} from './ExplorerFileItemView';
import {ExplorerFolderItemView} from './ExplorerFolderItemView';
import {FileTypePillsView} from './FileTypePillsView';
import {FolderBreadcrumbView} from './FolderBreadcrumbView';
import {LoadingView} from './LoadingView';

import template from '../templates/explorerFiles.jst';
import blankSlateTemplate from '../templates/explorerFilesBlankSlate.jst';

export const ExplorerFilesView = Marionette.ItemView.extend({
  template,
  className: 'explorer_files',

  ui: {
    pills: '.explorer_files-pills',
    breadcrumb: '.explorer_files-breadcrumb',
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
      fileFolders: this.options.entry.fileFolders,
      fileTypeSelection: this.options.fileTypeSelection,
      hideEmptyFolders: true,
      ignoreAbsentFileTypes: true
    });

    this.listenTo(this.fileListing, 'change:folder', this.renderBreadcrumb);

    this.loading = true;

    $.when(this.options.entry.fetchFiles(),
           this.options.entry.fileFolders.fetch()).always(() => {
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

  selectFolder: function(folder) {
    this.fileListing.set('folder', folder);
  },

  renderBreadcrumb: function() {
    var folder = this.fileListing.get('folder');

    if (this.breadcrumbView) {
      this.breadcrumbView.close();
      this.breadcrumbView = null;
    }

    if (folder) {
      this.breadcrumbView = this.subview(new FolderBreadcrumbView({
        model: folder,
        fileFolders: this.options.entry.fileFolders,
        rootLabel: this.options.entry.titleOrSlug(),
        onSelect: this.selectFolder.bind(this)
      }));

      this.ui.breadcrumb.append(this.breadcrumbView.el);
    }
  },

  renderGallery: function() {
    if (this.galleryView) {
      this.galleryView.close();
    }

    this.galleryView = this.subview(this.loading ? new LoadingGalleryView() : new CollectionView({
      tagName: 'ul',
      className: 'files_gallery',
      collection: this.fileListing.listItems,
      itemViewConstructor: GalleryItemView,
      itemViewOptions: {
        selection: this.options.selection,
        currentEntry: this.options.currentEntry,
        onSelectFolder: this.selectFolder.bind(this)
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

// Returning a view from a constructor makes it the result of the `new`
// expression, which lets folders and files share one gallery.
function GalleryItemView(options) {
  if (options.model instanceof FileFolder) {
    return new ExplorerFolderItemView(options);
  }

  return new ExplorerFileItemView(options);
}

const LoadingGalleryView = Marionette.View.extend({
  tagName: 'ul',
  className: 'files_gallery',

  render: function() {
    this.appendSubview(new LoadingView());
    return this;
  }
});
