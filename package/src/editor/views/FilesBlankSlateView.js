import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';


import template from '../templates/filesBlankSlate.jst';

export const FilesBlankSlateView = Marionette.ItemView.extend({
  template,

  initialize: function() {
    this.listenTo(this.options.files, 'add remove change:folder_perma_id', this.render);
  },

  serializeData: function() {
    return {text: this.text()};
  },

  // Saying that there are no files would be misleading when the list
  // only looks empty because the file type filter or the search term
  // hide what the folder holds.
  text: function() {
    if (this.filesInFolder().length) {
      return I18n.t('pageflow.editor.views.files_blank_slate_view.no_matches');
    }

    if (this.options.folder) {
      return I18n.t('pageflow.editor.views.files_blank_slate_view.empty_folder');
    }

    return this.options.text;
  },

  filesInFolder: function() {
    var permaId = this.options.folder ? this.options.folder.get('perma_id') : null;

    return this.options.files.filter(function(file) {
      return file.get('folder_perma_id') === permaId;
    });
  }
});
