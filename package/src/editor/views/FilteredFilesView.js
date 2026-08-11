import $ from 'jquery';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import Backbone from 'backbone';

import {CollectionView, i18nUtils} from 'pageflow/ui';
import {DropDownButtonView} from './DropDownButtonView';

import {editor} from '../base';

import {CombinedFilesCollection} from '../collections/CombinedFilesCollection';
import {ConcatenatedCollection} from '../collections/ConcatenatedCollection';
import {ListSelection} from '../collections/ListSelection';
import {SubsetCollection} from '../collections/SubsetCollection';
import {FilesBlankSlateView} from './FilesBlankSlateView';
import {FilesListItemView} from './FilesListItemView';
import {FileTypePillsView} from './FileTypePillsView';
import {FolderBreadcrumbView} from './FolderBreadcrumbView';
import {Search} from '../models/Search';
import {ListHighlight} from '../models/ListHighlight';
import {ListSearchFieldView} from './ListSearchFieldView';
import {MoveToFolderDialogView} from './MoveToFolderDialogView';

import template from '../templates/filteredFiles.jst';

export const FilteredFilesView = Marionette.ItemView.extend({
  template,
  className: 'filtered_files',

  ui: {
    banner: '.filtered_files-banner',
    bannerText: '.filtered_files-banner_text',
    bannerDismiss: '.filtered_files-banner_dismiss',
    header: '.filtered_files-header',
    browseControls: '.filtered_files-browse_controls',
    filterBar: '.filtered_files-filter_bar',
    selectionBar: '.filtered_files-selection_bar',
    selectionBarText: '.filtered_files-selection_bar_text',
    selectionBarAction: '.filtered_files-selection_bar_action',
    selectionBarDismiss: '.filtered_files-selection_bar_dismiss',
    list: '.filtered_files-list',
    sort: '.filtered_files-sort',
  },

  events: {
    // Leaves selection mode and any named filter behind, but stays in
    // the files list and in the current folder. Returning to where the
    // selection was requested from is what the back button is for.
    'click .filtered_files-banner_dismiss': function() {
      this.options.onDismissSelection();
      return false;
    },

    // Moving is all a selection is good for so far, so the check boxes
    // go away again once the files have been moved.
    'click .filtered_files-selection_bar_action': function() {
      MoveToFolderDialogView.open({
        models: this.listSelection.models,
        fileFolders: this.options.fileFolders,
        onMove: () => this.stopSelecting()
      });

      return false;
    },

    'click .filtered_files-selection_bar_dismiss': function() {
      this.stopSelecting();
      return false;
    }
  },

  initialize: function() {
    this.search = new Search({}, {
      attribute: 'display_name',
      storageKey: 'pageflow.filtered_files.sort_order'
    });

    var collections = this.options.fileTypes.map(function(fileType) {
      return this.options.entry.getFileCollection(fileType);
    }, this);

    if (this.options.filterName) {
      this.filteredCollections = collections.map(function(collection) {
        return collection.withFilter(this.options.filterName);
      }, this);
    }

    this.combinedFiles = new CombinedFilesCollection({
      collections: this.filteredCollections || collections
    });

    if (this.options.fileTypeSelection) {
      this.selectedFiles = new SubsetCollection({
        parent: this.combinedFiles,
        filter: this.matchesFileTypeSelection.bind(this)
      });

      this.listenTo(this.options.fileTypeSelection, 'change:collectionNames', function() {
        this.selectedFiles.updateFilter(this.matchesFileTypeSelection.bind(this));
      });
    }

    if (this.options.fileFolders) {
      this.folderFiles = new SubsetCollection({
        parent: this.selectedFiles || this.combinedFiles,
        filter: this.matchesFolder.bind(this),
        watchAttribute: 'folder_perma_id'
      });

      this.visibleFolders = new SubsetCollection({
        parent: this.options.fileFolders,
        filter: this.isVisibleFolder.bind(this),
        watchAttribute: 'parent_folder_perma_id'
      });

      this.listenTo(this.search, 'change:term', function() {
        this.folderFiles.updateFilter(this.matchesFolder.bind(this));
        this.updateVisibleFolders();
      });

      this.listenTo(this.combinedFiles,
                    'add remove change:folder_perma_id',
                    this.updateVisibleFolders);

      if (this.options.fileTypeSelection) {
        this.listenTo(this.options.fileTypeSelection,
                      'change:collectionNames',
                      this.updateVisibleFolders);
      }
    }

    this.searchFilteredCollection = this.search.applyTo(this.folderFiles ||
                                                       this.selectedFiles ||
                                                       this.combinedFiles);

    // Folders and files form one list, so that keyboard navigation
    // reaches both and the blank slate only appears once neither is
    // left.
    this.listItems = new ConcatenatedCollection({
      collections: [this.visibleFolders, this.searchFilteredCollection].filter(Boolean)
    });

    if (this.options.selectionHandler) {
      this.listHighlight = new ListHighlight({}, {collection: this.listItems});
    }
    else {
      this.setupListSelection();
    }

    this.menuItems = this.createMenuItems();
  },

  setupListSelection: function() {
    this.listSelection = new ListSelection();

    // An item which has been moved, deleted or filtered out has no row
    // left to uncheck, so the number in the bar would stop matching the
    // list.
    this.listenTo(this.listItems, 'remove', function(model) {
      this.listSelection.remove(model);
    });

    this.listenTo(this.listSelection, 'add remove reset', this.updateSelectionBar);
    this.listenTo(this.listSelection, 'change:selecting', this.updateSelecting);

    this.listenTo(this.combinedFiles, 'add remove', this.updateSelectable);

    if (this.options.fileFolders) {
      this.listenTo(this.options.fileFolders,
                    'add remove change:id',
                    this.updateSelectable);
    }
  },

  onRender: function() {
    this.renderBanner();
    this.renderSearchField();
    this.renderMenu();
    this.renderFileTypePills();
    this.renderBreadcrumb();
    this.renderCollectionView();
    this.updateSelecting();

    if (this.listSelection) {
      this.updateSelectable();
    }
  },

  // Being in selection mode is easy to overlook once the list fills the
  // sidebar, so the banner spells out what is being looked for.
  renderBanner: function() {
    // Rendering it hidden is not an option, since jQuery would set an
    // inline display of block on the still detached element, which the
    // flex layout of the banner would not survive.
    if (!this.options.filterName && !this.options.selectionHandler) {
      return this.ui.banner.remove();
    }

    var dismissLabel = this.bannerTranslation(this.options.selectionHandler ?
                                              'cancel_selection' :
                                              'reset_filter');

    this.renderBannerText();
    this.ui.bannerDismiss.attr({title: dismissLabel, 'aria-label': dismissLabel});
  },

  // Emphasizes the name inside the sentence without requiring markup in
  // the translation.
  renderBannerText: function() {
    var placeholder = '\u0000';
    var parts = this.bannerTranslation('select', {name: placeholder}).split(placeholder);

    this.ui.bannerText.empty()
        .append(document.createTextNode(parts[0]))
        .append($('<span />', {class: 'filtered_files-banner_name',
                               text: this.selectionName()}))
        .append(document.createTextNode(parts[1] || ''));
  },

  // The view which requested the selection knows best what the file
  // will be used for. A named filter is only ever requested for a
  // single file type and its name already says which.
  selectionName: function() {
    return this.options.selectionHandler?.selectionLabel ||
           (this.options.filterName && this.filterTranslation('name')) ||
           this.fileTypeName() ||
           this.bannerTranslation('any_file_type');
  },

  fileTypeName: function() {
    if (!this.options.selectionFileType) {
      return;
    }

    var collectionName = this.options.selectionFileType.collectionName;

    return i18nUtils.findTranslation([
      'pageflow.editor.files.singular.' + collectionName,
      'pageflow.editor.files.tabs.' + collectionName
    ]);
  },

  bannerTranslation: function(keyName, options) {
    return this.translation(keyName, options);
  },

  renderSearchField() {
    this.searchFieldView = this.appendSubview(new ListSearchFieldView({
      search: this.search,
      label: this.searchLabel(),
      hintTranslationKey: this.searchHintTranslationKey(),
      listHighlight: this.listHighlight,
      ariaControlsId: 'filtered_files',
      autoFocus: !!this.options.selectionHandler
    }), {to: this.ui.filterBar});
  },

  searchHintTranslationKey: function() {
    return this.options.folder ?
           'pageflow.editor.templates.list_search_field.hint_in_folder' :
           'pageflow.editor.templates.list_search_field.hint_in_all_folders';
  },

  searchLabel: function() {
    if (this.options.folder) {
      return I18n.t('pageflow.editor.views.filtered_files_view.search_in_folder',
                    {folder: this.options.folder.get('name')});
    }

    return I18n.t('pageflow.editor.views.filtered_files_view.search');
  },

  renderMenu: function() {
    this.appendSubview(new DropDownButtonView({
      title: this.translation('actions'),
      alignMenu: 'right',
      ellipsisIcon: true,
      openOnClick: true,
      items: this.menuItems
    }), {to: this.ui.filterBar});
  },

  createMenuItems: function() {
    var items = new Backbone.Collection([
      {
        name: 'sort',
        label: this.translation('sort_button_label'),
        items: new SortMenuItemsCollection([
          {name: 'alphabetical'},
          {name: 'most_recent'}
        ], {search: this.search})
      }
    ]);

    if (this.listSelection) {
      items.add({name: 'select', label: this.translation('select_items')});
      items.findWhere({name: 'select'}).selected = () => this.startSelecting();
    }

    return items;
  },

  startSelecting: function() {
    this.listSelection.start();
  },

  stopSelecting: function() {
    this.listSelection.stop();
  },

  updateSelecting: function() {
    if (!this.listSelection) {
      return this.ui.selectionBar.remove();
    }

    var selecting = this.listSelection.isSelecting();

    this.ui.browseControls.toggleClass('is_hidden', selecting);
    this.ui.selectionBar.toggleClass('is_hidden', !selecting);
    this.collectionView.$el.toggleClass('is_selecting', selecting);

    var dismissLabel = this.translation('end_selection');

    this.ui.selectionBarDismiss.attr({title: dismissLabel, 'aria-label': dismissLabel});
    this.ui.selectionBarAction.text(this.translation('move_selection'));

    // Files can only be moved into folders, so entries which have none
    // offer nothing to do with a selection yet.
    this.ui.selectionBarAction.toggle(!!this.options.fileFolders);

    this.updateSelectionBar();
  },

  // An entry without files and folders has nothing to check, so the bar
  // neither reserves space above the list nor can be opened from the
  // menu. Folders which are still being named have no row to check yet.
  updateSelectable: function() {
    var folders = this.options.fileFolders;

    var selectable = !!this.combinedFiles.length ||
                     !!folders && folders.some(function(folder) {
                       return !folder.isNew();
                     });

    if (!selectable) {
      this.listSelection.stop();
    }

    this.menuItems.findWhere({name: 'select'}).set('disabled', !selectable);
    this.ui.selectionBar.toggleClass('is_unavailable', !selectable);
  },

  updateSelectionBar: function() {
    this.ui.selectionBarText.text(this.translation('selected_items',
                                                   {count: this.listSelection.length}));

    this.ui.selectionBarAction.prop('disabled', !this.listSelection.length);
  },

  translation: function(keyName, options) {
    return I18n.t('pageflow.editor.views.filtered_files_view.' + keyName, options);
  },

  renderFileTypePills: function() {
    if (!this.options.fileTypeSelection) {
      return;
    }

    this.appendSubview(new FileTypePillsView({
      entry: this.options.entry,
      fileTypes: this.options.fileTypes,
      fileTypeSelection: this.options.fileTypeSelection
    }), {to: this.ui.browseControls});
  },

  renderBreadcrumb: function() {
    if (!this.options.folder) {
      return;
    }

    var view = this.subview(new FolderBreadcrumbView({
      model: this.options.folder,
      fileFolders: this.options.fileFolders,
      onSelect: this.options.onSelectFolder
    }));

    view.$el.insertBefore(this.ui.list);
  },

  renderCollectionView: function() {
    var blankSlateText = this.options.filterName ?
                         this.filterTranslation('blank_slate') :
                         I18n.t('pageflow.editor.templates.files_blank_slate.no_files');

    this.collectionView = this.subview(new CollectionView({
      tagName: 'ul',
      id: 'filtered_files',
      className: 'files',
      collection: this.listItems,
      itemViewConstructor: FilesListItemView,
      itemViewOptions: {
        onSelect: this.options.onSelectFolder,
        folder: this.options.folder,
        fileFolders: this.options.fileFolders,
        files: this.selectedFiles || this.combinedFiles,
        listSelection: this.listSelection,
        selectionHandler: this.options.selectionHandler,
        listHighlight: this.listHighlight
      },
      blankSlateViewConstructor: FilesBlankSlateView,
      blankSlateViewOptions: {
        text: blankSlateText,
        folder: this.options.folder,
        fileFolders: this.options.fileFolders,
        files: this.combinedFiles
      }
    }));

    this.appendSubview(this.collectionView, {to: this.ui.list});
  },

  filterTranslation: function(keyName, options) {
    var filterName = this.options.filterName;
    var collectionName = this.filteredFileType().collectionName;

    var entryTypeName = editor.entryType.name;

    return i18nUtils.findTranslation([
      'pageflow.entry_types.' + entryTypeName + '.editor.files.filters.' +
        collectionName + '.' +
        filterName + '.' +
        keyName,
      'pageflow.entry_types.' + entryTypeName + '.editor.files.common_filters.' + keyName,
      'pageflow.editor.files.filters.' +
        collectionName + '.' +
        filterName + '.' +
        keyName,
      'pageflow.editor.files.common_filters.' + keyName
    ], options);
  },

  // Named filters are only ever requested for a single file type.
  filteredFileType: function() {
    return this.options.fileTypes[0];
  },

  matchesFileTypeSelection: function(file) {
    return this.options.fileTypeSelection.matches(file);
  },

  // Searching the root list looks into all folders. Inside a folder,
  // searching stays scoped to that folder.
  matchesFolder: function(file) {
    if (this.searchesAllFolders()) {
      return true;
    }

    return file.get('folder_perma_id') === this.folderPermaId();
  },

  // Folder name hits are only of interest while searching the root list.
  // Inside a folder, subfolders would just be noise among the file hits.
  isVisibleFolder: function(folder) {
    if (this.search.get('term')) {
      return this.searchesAllFolders() && this.search.matchesValue(folder.get('name'));
    }

    if (folder.get('parent_folder_perma_id') !== this.folderPermaId()) {
      return false;
    }

    return folder.isNew() || this.containsSelectedFileTypes(folder);
  },

  // Filtering by file type would otherwise keep listing folders which
  // turn out empty once entered.
  containsSelectedFileTypes: function(folder) {
    if (!this.selectedFiles || !this.options.fileTypeSelection.get('collectionNames').length) {
      return true;
    }

    var permaIds = this.options.fileFolders.descendantPermaIdsOf(folder);

    return this.selectedFiles.some(function(file) {
      return permaIds.indexOf(file.get('folder_perma_id')) >= 0;
    });
  },

  updateVisibleFolders: function() {
    this.visibleFolders.updateFilter(this.isVisibleFolder.bind(this));
  },

  searchesAllFolders: function() {
    return !this.options.folder && !!this.search.get('term');
  },

  folderPermaId: function() {
    return this.options.folder ? this.options.folder.get('perma_id') : null;
  },

  onClose: function() {
    Marionette.ItemView.prototype.onClose.call(this);

    this.filteredCollections?.forEach(collection => collection.dispose());
    this.selectedFiles?.dispose();
    this.folderFiles?.dispose();
    this.visibleFolders?.dispose();
    this.combinedFiles.dispose();
    this.searchFilteredCollection.dispose();
    this.listItems.dispose();
  }
});

const SortMenuItem = Backbone.Model.extend({
  initialize(attributes, options) {
    this.search = options.search;

    this.set('label', I18n.t(`pageflow.editor.views.filtered_files_view.sort.${this.get('name')}`));
    this.set('kind', 'radio');

    const updateChecked = () => {
      this.set('checked', this.search.get('order') === this.get('name'));
    };

    this.listenTo(this.search, 'change:order', updateChecked);
    updateChecked();
  },

  selected() {
    this.search.set('order', this.get('name'));
  }
});

const SortMenuItemsCollection = Backbone.Collection.extend({
  model: SortMenuItem
});
