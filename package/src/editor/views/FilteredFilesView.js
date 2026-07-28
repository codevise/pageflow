import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import Backbone from 'backbone';

import {CollectionView, i18nUtils} from 'pageflow/ui';
import {DropDownButtonView} from './DropDownButtonView';

import {editor} from '../base';

import {CombinedFilesCollection} from '../collections/CombinedFilesCollection';
import {SubsetCollection} from '../collections/SubsetCollection';
import {FileItemView} from './FileItemView';
import {FileTypePillsView} from './FileTypePillsView';
import {Search} from '../models/Search';
import {ListHighlight} from '../models/ListHighlight';
import {ListSearchFieldView} from './ListSearchFieldView';

import template from '../templates/filteredFiles.jst';

import blankSlateTemplate from '../templates/filesBlankSlate.jst';

export const FilteredFilesView = Marionette.ItemView.extend({
  template,
  className: 'filtered_files',

  ui: {
    banner: '.filtered_files-banner',
    filterName: '.filtered_files-filter_name',
    header: '.filtered_files-header',
    filterBar: '.filtered_files-filter_bar',
    sort: '.filtered_files-sort',
  },

  events: {
    'click .filtered_files-reset_filter': function() {
      editor.navigate('/files/' + this.filteredFileType().collectionName, {trigger: true});
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

    this.searchFilteredCollection = this.search.applyTo(this.selectedFiles ||
                                                       this.combinedFiles);

    if (this.options.selectionHandler) {
      this.listHighlight = new ListHighlight({}, {collection: this.searchFilteredCollection});
    }
  },

  onRender: function() {
    this.renderNamedFilter();
    this.renderSearchField();
    this.renderSortMenu();
    this.renderFileTypePills();
    this.renderCollectionView();
  },

  renderNamedFilter: function() {
    this.ui.banner.toggle(!!this.options.filterName);

    if (this.options.filterName) {
      this.ui.filterName.text(this.filterTranslation('name'));
    }
  },

  renderSearchField() {
    this.searchFieldView = this.appendSubview(new ListSearchFieldView({
      search: this.search,
      listHighlight: this.listHighlight,
      ariaControlsId: 'filtered_files',
      autoFocus: !!this.options.selectionHandler
    }), {to: this.ui.filterBar});
  },

  renderSortMenu: function() {
    this.appendSubview(new DropDownButtonView({
      title: I18n.t('pageflow.editor.views.filtered_files_view.sort_button_label'),
      alignMenu: 'right',
      openOnClick: true,
      items: new SortMenuItemsCollection([
        {name: 'alphabetical'},
        {name: 'most_recent'}
      ], {search: this.search})
    }), {to: this.ui.filterBar});
  },

  renderFileTypePills: function() {
    if (!this.options.fileTypeSelection) {
      return;
    }

    this.appendSubview(new FileTypePillsView({
      entry: this.options.entry,
      fileTypes: this.options.fileTypes,
      fileTypeSelection: this.options.fileTypeSelection
    }), {to: this.ui.header});
  },

  renderCollectionView: function() {
    var blankSlateText = this.options.filterName ?
                         this.filterTranslation('blank_slate') :
                         I18n.t('pageflow.editor.templates.files_blank_slate.no_files');

    this.appendSubview(this.subview(new CollectionView({
      tagName: 'ul',
      id: 'filtered_files',
      className: 'files expandable',
      collection: this.searchFilteredCollection,
      itemViewConstructor: FileItemView,
      itemViewOptions: file => ({
        metaDataAttributes: file.fileType().metaDataAttributes,
        selectionHandler: this.options.selectionHandler,
        listHighlight: this.listHighlight
      }),
      blankSlateViewConstructor: Marionette.ItemView.extend({
        template: blankSlateTemplate,
        serializeData: function(){
          return {
            text: blankSlateText
          };
        }
      })
    })));
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

  onClose: function() {
    Marionette.ItemView.prototype.onClose.call(this);

    this.filteredCollections?.forEach(collection => collection.dispose());
    this.selectedFiles?.dispose();
    this.combinedFiles.dispose();
    this.searchFilteredCollection.dispose();
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
