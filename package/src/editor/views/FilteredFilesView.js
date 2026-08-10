import $ from 'jquery';
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
    bannerText: '.filtered_files-banner_text',
    bannerDismiss: '.filtered_files-banner_dismiss',
    header: '.filtered_files-header',
    filterBar: '.filtered_files-filter_bar',
    sort: '.filtered_files-sort',
  },

  events: {
    // Leaves selection mode and any named filter behind, but stays in
    // the files list. Returning to where the selection was requested
    // from is what the back button is for.
    'click .filtered_files-banner_dismiss': function() {
      editor.navigate('/files', {trigger: true});
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
    this.renderBanner();
    this.renderSearchField();
    this.renderSortMenu();
    this.renderFileTypePills();
    this.renderCollectionView();
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
    return I18n.t('pageflow.editor.views.filtered_files_view.' + keyName, options);
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
      className: 'files',
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
