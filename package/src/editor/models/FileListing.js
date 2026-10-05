import Backbone from 'backbone';

import {CombinedFilesCollection} from '../collections/CombinedFilesCollection';
import {ConcatenatedCollection} from '../collections/ConcatenatedCollection';
import {SubsetCollection} from '../collections/SubsetCollection';

export const FileListing = Backbone.Model.extend({
  defaults: {
    folder: null
  },

  initialize: function(attributes, options) {
    this.collections = options.collections;
    this.fileFolders = options.fileFolders;
    this.fileTypeSelection = options.fileTypeSelection;
    this.search = options.search;
    this.hideEmptyFolders = options.hideEmptyFolders;
    this.ignoreAbsentFileTypes = options.ignoreAbsentFileTypes;

    this.files = new CombinedFilesCollection({collections: this.collections});
    this.selectedFiles = this.files;

    if (this.fileTypeSelection) {
      this.selectedFiles = new SubsetCollection({
        parent: this.files,
        filter: this.matchesFileTypeSelection.bind(this)
      });

      this.listenTo(this.fileTypeSelection, 'change:collectionNames', this.updateFileTypeFilter);
    }

    if (this.fileFolders) {
      this.folderFiles = new SubsetCollection({
        parent: this.selectedFiles,
        filter: this.matchesFolder.bind(this),
        watchAttribute: 'folder_perma_id'
      });

      this.visibleFolders = new SubsetCollection({
        parent: this.fileFolders,
        filter: this.isVisibleFolder.bind(this),
        watchAttribute: 'parent_folder_perma_id'
      });

      this.listenTo(this, 'change:folder', this.updateFolderFilter);

      if (this.search) {
        this.listenTo(this.search, 'change:term', this.updateFolderFilter);
      }

      this.listenTo(this.files,
                    'add remove change:folder_perma_id',
                    this.updateVisibleFolders);
    }

    var listedFiles = this.folderFiles || this.selectedFiles;

    this.searchFilteredFiles = this.search ? this.search.applyTo(listedFiles) : listedFiles;

    // Folders and files form one list, so that keyboard navigation
    // reaches both and the blank slate only appears once neither is
    // left.
    this.listItems = new ConcatenatedCollection({
      collections: [this.visibleFolders, this.searchFilteredFiles].filter(Boolean)
    });
  },

  updateFileTypeFilter: function() {
    if (this.selectedFiles !== this.files) {
      this.selectedFiles.updateFilter(this.matchesFileTypeSelection.bind(this));
    }

    this.updateVisibleFolders();
  },

  updateFolderFilter: function() {
    this.folderFiles.updateFilter(this.matchesFolder.bind(this));
    this.updateVisibleFolders();
  },

  updateVisibleFolders: function() {
    if (this.visibleFolders) {
      this.visibleFolders.updateFilter(this.isVisibleFolder.bind(this));
    }
  },

  matchesFileTypeSelection: function(file) {
    var collectionNames = this.selectedCollectionNames();

    return !collectionNames.length ||
           collectionNames.includes(file.fileType().collectionName);
  },

  selectedCollectionNames: function() {
    var collectionNames = this.fileTypeSelection.get('collectionNames');

    if (!this.ignoreAbsentFileTypes) {
      return collectionNames;
    }

    return collectionNames.filter(function(collectionName) {
      return this.collections.some(function(collection) {
        return collection.fileType.collectionName === collectionName && collection.length;
      });
    }, this);
  },

  // Searching the root list looks into all folders. Inside a folder,
  // searching stays scoped to that folder.
  matchesFolder: function(file) {
    if (this.searchesAllFolders()) {
      return true;
    }

    return (file.get('folder_perma_id') || null) === this.folderPermaId();
  },

  // Folder name hits are only of interest while searching the root list.
  // Inside a folder, subfolders would just be noise among the file hits.
  isVisibleFolder: function(folder) {
    if (this.search && this.search.get('term')) {
      return this.searchesAllFolders() &&
             this.search.matchesValue(folder.get('name')) &&
             this.containsListedFiles(folder);
    }

    if (folder.get('parent_folder_perma_id') !== this.folderPermaId()) {
      return false;
    }

    return folder.isNew() || this.containsListedFiles(folder);
  },

  // Filtering by file type would otherwise keep listing folders which
  // turn out empty once entered.
  containsListedFiles: function(folder) {
    if (!this.hideEmptyFolders && !this.selectedCollectionNamesPresent()) {
      return true;
    }

    var permaIds = this.fileFolders.descendantPermaIdsOf(folder);

    return this.selectedFiles.some(function(file) {
      return permaIds.indexOf(file.get('folder_perma_id')) >= 0;
    });
  },

  selectedCollectionNamesPresent: function() {
    return !!this.fileTypeSelection && !!this.selectedCollectionNames().length;
  },

  searchesAllFolders: function() {
    return !this.get('folder') && !!this.search && !!this.search.get('term');
  },

  folderPermaId: function() {
    var folder = this.get('folder');
    return folder ? folder.get('perma_id') : null;
  },

  dispose: function() {
    this.stopListening();

    this.listItems.dispose();

    if (this.searchFilteredFiles !== (this.folderFiles || this.selectedFiles)) {
      this.searchFilteredFiles.dispose();
    }

    this.visibleFolders?.dispose();
    this.folderFiles?.dispose();

    if (this.selectedFiles !== this.files) {
      this.selectedFiles.dispose();
    }

    this.files.dispose();
  }
});
