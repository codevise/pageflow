import Backbone from 'backbone';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {app} from '../app';

import {ListSelection} from '../collections/ListSelection';
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
        this.options.callback(this.selection.get('entry'), this.selectedFiles());
      }
      this.close();
    }
  },

  initialize: function() {
    this.selection = new Backbone.Model();
    this.markedFiles = new ListSelection();
    this.fileTypeSelection = new FileTypeSelection();
    this.listenTo(this.selection, 'change:entry', this.renderFiles);

    this.listenTo(this.selection, 'change', this.updateOkButton);
    this.listenTo(this.markedFiles, 'add remove reset', this.updateOkButton);
  },

  selectedFiles: function() {
    return this.markedFiles.length ?
           this.markedFiles.models.slice() :
           [this.selection.get('file')];
  },

  updateOkButton: function() {
    this.ui.okButton.prop('disabled', !this.markedFiles.length && !this.selection.get('file'));
    this.ui.okButton.text(this.markedFiles.length ?
                          I18n.t('pageflow.editor.views.files_explorer_view.reuse_files',
                                 {count: this.markedFiles.length}) :
                          I18n.t('pageflow.editor.templates.files_explorer.ok'));
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

    this.updateOkButton();
  },

  renderFiles: function() {
    var entry = this.selection.get('entry');

    this.markedFiles.reset();

    if (this.filesView) {
      this.filesView.close();
    }

    this.filesView = this.subview(entry ?
                                  new ExplorerFilesView({
                                    entry: entry,
                                    currentEntry: state.entry,
                                    selection: this.selection,
                                    markedFiles: this.markedFiles,
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
