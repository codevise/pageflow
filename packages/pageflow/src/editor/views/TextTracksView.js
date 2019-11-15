import Backbone from 'backbone';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {app} from '../app';
import {editor} from '../base';

import {EditFileView} from './EditFileView';
import {NestedFilesView} from './NestedFilesView';

import template from '../templates/textTracks.jst';

export const TextTracksView = Marionette.Layout.extend({
  template,
  className: 'text_tracks',

  regions: {
    selectedFileRegion: '.selected_file_region'
  },

  ui: {
    filesPanel: '.files_panel',
    selectedFileHeader: '.selected_file_header'
  },

  events: {
    'click a.upload': 'upload'
  },

  initialize: function(options) {
    this.options = options || {};
    this.selection = new Backbone.Model();
    this.listenTo(this.selection, 'change', this.update);
  },

  onRender: function() {
    this.nestedFilesView = new NestedFilesView({
      collection: this.model.nestedFiles(this.options.supersetCollection),
      fileType: editor.fileTypes.findByCollectionName('text_track_files'),
      selection: this.selection,
      model: this.model,
      tableBlankSlateText:
      I18n.t('pageflow.editor.nested_files.text_track_files.no_files_blank_slate')
    });

    this.ui.filesPanel.append(this.subview(this.nestedFilesView).el);

    this.update();

    editor.setUploadTargetFile(this.model);
  },

  onClose: function() {
    editor.setUploadTargetFile(undefined);
  },

  update: function() {
    var selectedFile = this.selection.get('file');
    if (selectedFile) {
      this.selectedFileRegion.show(new EditFileView({
        model: selectedFile,
        attributeTranslationKeyPrefixes: [
          'pageflow.editor.nested_files.text_track_files'
        ]
      }));
      this.ui.selectedFileHeader.toggle(true);
    }
    else {
      this.selectedFileRegion.close();
      this.ui.selectedFileHeader.toggle(false);
    }
  },

  upload: function() {
    app.trigger('request-upload');
  }
});
