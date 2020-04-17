import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {CollectionView, i18nUtils} from 'pageflow/ui';

import {editor} from '../base';

import {FileItemView} from './FileItemView';

import template from '../templates/filteredFiles.jst';

import blankSlateTemplate from '../templates/filesBlankSlate.jst';

export const FilteredFilesView = Marionette.ItemView.extend({
  template,
  className: 'filtered_files',

  ui: {
    banner: '.filtered_files-banner',
    filterName: '.filtered_files-filter_name'
  },

  events: {
    'click .filtered_files-reset_filter': function() {
      editor.navigate('/files/' + this.options.fileType.collectionName, {trigger: true});
      return false;
    }
  },

  onRender: function() {
    var entry = this.options.entry;
    var fileType = this.options.fileType;
    var collection = entry.getFileCollection(fileType);
    var blankSlateText = I18n.t('pageflow.editor.templates.files_blank_slate.no_files');

    if (this.options.filterName) {
      if (this.filteredCollection) {
        this.filteredCollection.dispose();
      }

      collection = this.filteredCollection = collection.withFilter(this.options.filterName);
      blankSlateText = this.filterTranslation('blank_slate');
    }

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

    this.ui.banner.toggle(!!this.options.filterName);

    if (this.options.filterName) {
      this.ui.filterName.text(this.filterTranslation('name'));
    }
  },

  filterTranslation: function(keyName, options) {
    var filterName = this.options.filterName;

    return i18nUtils.findTranslation([
      'pageflow.editor.files.filters.' +
        this.options.fileType.collectionName + '.' +
        filterName + '.' +
        keyName,
      'pageflow.editor.files.common_filters.' + keyName
    ], options);
  },

  onClose: function() {
    if (this.filteredCollection) {
      this.filteredCollection.dispose();
    }
  }
});
