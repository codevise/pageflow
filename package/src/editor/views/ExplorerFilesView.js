import $ from 'jquery';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {CollectionView} from 'pageflow/ui';

import {editor} from '../base';

import {FileFolder} from '../models/FileFolder';
import {FileListing} from '../models/FileListing';
import {Search} from '../models/Search';
import {ExplorerFileItemView} from './ExplorerFileItemView';
import {ExplorerFolderItemView} from './ExplorerFolderItemView';
import {FileTypePillsView} from './FileTypePillsView';
import {FolderBreadcrumbView} from './FolderBreadcrumbView';
import {ListSearchFieldView} from './ListSearchFieldView';
import {LoadingView} from './LoadingView';

import template from '../templates/explorerFiles.jst';
import blankSlateTemplate from '../templates/explorerFilesBlankSlate.jst';

export const ExplorerFilesView = Marionette.ItemView.extend({
  template,
  className: 'explorer_files',

  ui: {
    filterBar: '.explorer_files-filter_bar',
    markingBar: '.explorer_files-marking_bar',
    markingBarText: '.explorer_files-marking_bar_text',
    search: '.explorer_files-search',
    pills: '.explorer_files-pills',
    breadcrumb: '.explorer_files-breadcrumb',
    gallery: '.explorer_files-gallery'
  },

  events: {
    'click .explorer_files-end_marking': function() {
      this.options.markedFiles.reset();
    }
  },

  initialize: function() {
    this.fileTypes = editor.fileTypes.filter(function(fileType) {
      return fileType.topLevelType;
    });

    this.search = new Search({}, {attribute: 'display_name'});

    this.fileListing = new FileListing({}, {
      collections: this.fileTypes.map(function(fileType) {
        return this.options.entry.getFileCollection(fileType);
      }, this),
      fileFolders: this.options.entry.fileFolders,
      fileTypeSelection: this.options.fileTypeSelection,
      search: this.search,
      hideEmptyFolders: true,
      ignoreAbsentFileTypes: true
    });

    this.listenTo(this.fileListing, 'change:folder', function() {
      this.options.markedFiles.reset();
      this.renderBreadcrumb();
    });

    this.listenTo(this.options.markedFiles, 'add remove reset', this.updateMarkingBar);

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
    this.appendSubview(new ListSearchFieldView({
      search: this.search,
      label: I18n.t('pageflow.editor.views.explorer_files_view.search'),
      hintTranslationKey: 'pageflow.editor.views.explorer_files_view.search_hint'
    }), {to: this.ui.search});

    this.appendSubview(new FileTypePillsView({
      entry: this.options.entry,
      fileTypes: this.fileTypes,
      fileTypeSelection: this.options.fileTypeSelection
    }), {to: this.ui.pills});

    this.renderGallery();
    this.updateMarkingBar();
  },

  updateMarkingBar: function() {
    var count = this.options.markedFiles.length;

    this.ui.filterBar.prop('hidden', !!count);
    this.ui.markingBar.prop('hidden', !count);
    this.ui.markingBarText.text(
      I18n.t('pageflow.editor.views.explorer_files_view.marked_files', {count})
    );
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
        markedFiles: this.options.markedFiles,
        onSelectFolder: this.selectFolder.bind(this)
      },
      blankSlateViewConstructor: BlankSlateView,
      blankSlateViewOptions: {
        search: this.search
      }
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

const BlankSlateView = Marionette.ItemView.extend({
  template: blankSlateTemplate,
  tagName: 'li',
  className: 'blank_slate',

  initialize: function() {
    this.listenTo(this.options.search, 'change:term', this.render);
  },

  serializeData: function() {
    return {
      text: I18n.t(this.options.search.get('term') ?
                   'pageflow.editor.views.explorer_files_view.no_matches' :
                   'pageflow.editor.views.explorer_files_view.no_files')
    };
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
