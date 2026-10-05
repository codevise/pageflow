import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import {app} from '../app';

import {FileTypeSelection} from '../models/FileTypeSelection';

import {ExplorerFileDetailsView} from './ExplorerFileDetailsView';
import {ExplorerFilesView} from './ExplorerFilesView';
import {OtherEntriesCollectionView} from './OtherEntriesCollectionView';
import {dialogView} from './mixins/dialogView';

import {state} from '$state';

import template from '../templates/filesExplorer.jst';
import filesExplorerBlankSlateTemplate from '../templates/filesExplorerBlankSlate.jst';

export const FilesExplorerView = Marionette.ItemView.extend({
  template,
  className: 'files_explorer editor dialog',

  mixins: [dialogView],

  ui: {
    entriesList: '.entries_panel-list',
    filesPanel: '.files_panel',
    fileDetailsPanel: '.file_details_panel',
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
    this.fileTypeSelection = new FileTypeSelection();
    this.listenTo(this.selection, 'change:entry', this.renderFiles);

    // check if the OK button should be enabled.
    this.listenTo(this.selection, 'change', function(selection, options) {
      this.ui.okButton.prop('disabled', !this.selection.get('file'));
    });
  },

  onRender: function() {
    this.subview(new OtherEntriesCollectionView({
      el: this.ui.entriesList,
      selection: this.selection
    }));

    this.renderFiles();

    this.appendSubview(new ExplorerFileDetailsView({
      selection: this.selection
    }), {to: this.ui.fileDetailsPanel});

    this.ui.okButton.prop('disabled', true);
  },

  renderFiles: function() {
    var entry = this.selection.get('entry');

    if (this.filesView) {
      this.filesView.close();
    }

    this.filesView = this.subview(entry ?
                                  new ExplorerFilesView({
                                    entry: entry,
                                    currentEntry: state.entry,
                                    selection: this.selection,
                                    fileTypeSelection: this.fileTypeSelection
                                  }) :
                                  new BlankSlateView());

    this.ui.filesPanel.append(this.filesView.el);
  }
});

const BlankSlateView = Marionette.ItemView.extend({
  template: filesExplorerBlankSlateTemplate,
  tagName: 'ul',
  className: 'files_gallery'
});

FilesExplorerView.open = function(options) {
  app.dialogRegion.show(new FilesExplorerView(options));
};
