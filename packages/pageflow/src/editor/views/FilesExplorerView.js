import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {CollectionView, TabsView} from 'pageflow/ui';

import {app} from '../app';
import {editor} from '../base';

import {ExplorerFileItemView} from './ExplorerFileItemView';
import {OtherEntriesCollectionView} from './OtherEntriesCollectionView';
import {dialogView} from './mixins/dialogView';

import {state} from '$state';

import template from '../templates/filesExplorer.jst';
import filesGalleryBlankSlateTemplate from '../templates/filesGalleryBlankSlate.jst';
import filesExplorerBlankSlateTemplate from '../templates/filesExplorerBlankSlate.jst';

export const FilesExplorerView = Marionette.ItemView.extend({
  template,
  className: 'files_explorer editor dialog',

  mixins: [dialogView],

  ui: {
    entriesPanel: '.entries_panel',
    filesPanel: '.files_panel',
    okButton: '.ok'
  },

  events: {
    'click .ok': function() {
      if (this.options.callback) {
        this.options.callback(this.selection.get('entry'),
                              this.selection.get('file'));
      }
      this.close();
    }
  },

  initialize: function() {
    this.selection = new Backbone.Model();
    this.listenTo(this.selection, 'change:entry', function() {
      this.tabsView.refresh();
    });

    // check if the OK button should be enabled.
    this.listenTo(this.selection, 'change', function(selection, options) {
      this.ui.okButton.prop('disabled', !this.selection.get('file'));
    });
  },

  onRender: function() {
    this.subview(new OtherEntriesCollectionView({
      el: this.ui.entriesPanel,
      selection: this.selection
    }));

    this.tabsView = new TabsView({
      model: this.model,
      i18n: 'pageflow.editor.files.tabs',
      defaultTab: this.options.tabName
    });

    editor.fileTypes.each(function(fileType) {
      if (fileType.topLevelType) {
        this.tab(fileType);
      }
    }, this);

    this.ui.filesPanel.append(this.subview(this.tabsView).el);

    this.ui.okButton.prop('disabled', true);
  },

  tab: function(fileType) {
    this.tabsView.tab(fileType.collectionName, _.bind(function() {
      var collection = this._collection(fileType);
      var disabledIds = state.entry.getFileCollection(fileType).pluck('id');

      return new CollectionView({
        tagName: 'ul',
        className: 'files_gallery',
        collection: collection,
        itemViewConstructor: ExplorerFileItemView,
        itemViewOptions: {
          selection: this.selection,
          disabledIds: disabledIds
        },
        blankSlateViewConstructor: this._blankSlateConstructor()
      });
    }, this));
  },

  _collection: function(fileType) {
    var collection,
        entry = this.selection.get('entry');

    if (entry) {
      collection = entry.getFileCollection(fileType);
      collection.fetch();
    } else {
      collection = new Backbone.Collection();
    }
    return collection;
  },

  _blankSlateConstructor: function() {
    return Marionette.ItemView.extend({
      template: this.selection.get('entry') ? filesGalleryBlankSlateTemplate : filesExplorerBlankSlateTemplate
    });
  }
});

FilesExplorerView.open = function(options) {
  app.dialogRegion.show(new FilesExplorerView(options));
};
