import I18n from 'i18n-js';

// Mixin for item views of the files list which name the folder an item
// was found in. Views need to provide a `parentFolderPermaId` method.
export const parentFolderLabel = {
  ui: {
    parentFolder: '.files-parent_folder',
    parentFolderLabel: '.files-parent_folder_label',
    parentFolderName: '.files-parent_folder_name'
  },

  initialize: function() {
    if (this.options.fileFolders) {
      this.listenTo(this.options.fileFolders, 'change:name', this.updateParentFolder);
    }
  },

  onRender: function() {
    this.updateParentFolder();
  },

  // Rows which name no folder are left without text, so that the hidden
  // label does not end up in the name of the button or check box of the
  // row.
  updateParentFolder: function() {
    var folder = this.parentFolder();

    this.ui.parentFolderLabel.text(
      folder ? I18n.t('pageflow.editor.templates.files.in_folder') : ''
    );
    this.ui.parentFolderName.text(folder ? folder.get('name') : '');
    this.ui.parentFolder.toggleClass('is_hidden', !folder);
  },

  // Only items outside the folder the list is displaying need their
  // folder named, which searching across folders is the only source of.
  parentFolder: function() {
    var permaId = this.parentFolderPermaId();

    if (!permaId || permaId === this.options.folder?.get('perma_id')) {
      return;
    }

    return this.options.fileFolders?.byPermaId(permaId);
  }
};
