import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import Backbone from 'backbone';

import {CollectionView, i18nUtils} from 'pageflow/ui';
import {DropDownButtonView} from './DropDownButtonView';

import {editor} from '../base';

import {FileItemView} from './FileItemView';
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
    filterBar: '.filtered_files-filter_bar',
    sort: '.filtered_files-sort',
  },

  events: {
    'click .filtered_files-reset_filter': function() {
      editor.navigate('/files/' + this.options.fileType.collectionName, {trigger: true});
      return false;
    }
  },

  initialize: function() {
    this.search = new Search({}, {
      attribute: 'display_name',
      storageKey: 'pageflow.filtered_files.sort_order'
    });

    var collection = this.options.entry.getFileCollection(this.options.fileType);

    if (this.options.filterName) {
      collection = this.filteredCollection = collection.withFilter(this.options.filterName);
    }

    this.searchFilteredCollection = this.search.applyTo(collection);

    if (this.options.selectionHandler) {
      this.listHighlight = new ListHighlight({}, {collection: this.searchFilteredCollection});
    }
  },

  onRender: function() {
    this.renderNamedFilter();
    this.renderSearchField();
    this.renderSortMenu();
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
      itemViewOptions: {
        metaDataAttributes: this.options.fileType.metaDataAttributes,
        selectionHandler: this.options.selectionHandler,
        listHighlight: this.listHighlight
      },
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
    Marionette.ItemView.prototype.onClose.call(this);

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
