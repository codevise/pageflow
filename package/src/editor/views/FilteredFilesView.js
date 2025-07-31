import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import Backbone from 'backbone';

import {CollectionView, i18nUtils} from 'pageflow/ui';
import {DropDownButtonView} from './DropDownButtonView';

import {editor} from '../base';

import {FileItemView} from './FileItemView';
import {Search} from '../models/Search';

import template from '../templates/filteredFiles.jst';

import blankSlateTemplate from '../templates/filesBlankSlate.jst';

export const FilteredFilesView = Marionette.ItemView.extend({
  template,
  className: 'filtered_files',

  ui: {
    banner: '.filtered_files-banner',
    filterName: '.filtered_files-filter_name',
    filterBar: '.filtered_files-filter_bar',
    nameFilter: '.filtered_files-name_filter',
    nameFilterWrapper: '.filtered_files-name_filter_wrapper',
    nameFilterReset: '.filtered_files-name_filter_reset',
    sort: '.filtered_files-sort'
  },

  events: {
    'click .filtered_files-reset_filter': function() {
      editor.navigate('/files/' + this.options.fileType.collectionName, {trigger: true});
      return false;
    },

    'input .filtered_files-name_filter': function() {
      this.search.set('term', this.ui.nameFilter.val());
      this.toggleNameFilterReset();
    },

    'click .filtered_files-name_filter_reset': function() {
      this.ui.nameFilter.val('');
      this.search.set('term', '');
      this.toggleNameFilterReset();
    }
  },

  initialize: function() {
    this.search = new Search(
      {term: ''},
      {
        attribute: 'file_name',
        storageKey: 'pageflow.filtered_files.sort_order'
      }
    );
  },

  onRender: function() {
    this.renderSortMenu();
    this.renderNamedFilter();
    this.renderCollectionView();

    this.toggleNameFilterReset();
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

  renderNamedFilter: function() {
    this.ui.banner.toggle(!!this.options.filterName);

    if (this.options.filterName) {
      this.ui.filterName.text(this.filterTranslation('name'));
    }
  },

  renderCollectionView: function() {
    var fileType = this.options.fileType;
    var collection = this.options.entry.getFileCollection(fileType);

    var blankSlateText = I18n.t('pageflow.editor.templates.files_blank_slate.no_files');

    if (this.options.filterName) {
      collection = this.filteredCollection = collection.withFilter(this.options.filterName);
      blankSlateText = this.filterTranslation('blank_slate');
    }

    collection = this.searchFilteredCollection = this.search.applyTo(collection);

    this.appendSubview(new CollectionView({
      tagName: 'ul',
      className: 'files expandable',
      collection: collection,
      itemViewConstructor: FileItemView,
      itemViewOptions: {
        metaDataAttributes: fileType.metaDataAttributes,
        selectionHandler: this.options.selectionHandler,
      },
      blankSlateViewConstructor: Marionette.ItemView.extend({
        template: blankSlateTemplate,
        serializeData: function(){
          return {
            text: blankSlateText
          };
        }
      })
    }));
  },

  toggleNameFilterReset: function() {
    this.ui.nameFilterWrapper.toggleClass('has_value', !!this.search.get('term'));
  },

  filterTranslation: function(keyName, options) {
    var filterName = this.options.filterName;

    var entryTypeName = editor.entryType.name;

    return i18nUtils.findTranslation([
      'pageflow.entry_types.' + entryTypeName + '.editor.files.filters.' +
        this.options.fileType.collectionName + '.' +
        filterName + '.' +
        keyName,
      'pageflow.entry_types.' + entryTypeName + '.editor.files.common_filters.' + keyName,
      'pageflow.editor.files.filters.' +
        this.options.fileType.collectionName + '.' +
        filterName + '.' +
        keyName,
      'pageflow.editor.files.common_filters.' + keyName
    ], options);
  },

  onClose: function() {
    this.filteredCollection?.dispose();
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
