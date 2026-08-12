import Backbone from 'backbone';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {TabsView} from 'pageflow/ui';

import {app} from '../app';
import {editor} from '../base';

import {FileTypeSelection} from '../models/FileTypeSelection';
import {FilesExplorerView} from './FilesExplorerView';
import {FilteredFilesView} from './FilteredFilesView';
import {ChooseImporterView} from './ChooseImporterView';
import {FilesImporterView} from './FilesImporterView';
import {DropDownButtonView} from './DropDownButtonView';
import {filesPath} from '../utils/filesPath';

import {state} from '$state';

import template from '../templates/files.jst';

export const FilesView = Marionette.ItemView.extend({
  template,
  className: 'manage_files',

  events: {
    'click a.back': 'goBack',

    'file-selected': 'updatePage'
  },

  onRender: function() {

    let menuOptions = [
      {
        label: I18n.t('pageflow.editor.views.files_view.upload'),
        handler: this.upload.bind(this)
      },
      {
        label: I18n.t('pageflow.editor.views.files_view.reuse'),
        handler: () => {
          FilesExplorerView.open({
            callback: (otherEntry, file) => {
              state.entry.reuseFile(otherEntry, file, {
                folderPermaId: this.currentFolderPermaId()
              });
            }
          });
        }
      }
    ]
    if(editor.fileImporters.keys().length > 0){
      menuOptions.push({
        label: I18n.t('pageflow.editor.views.files_view.import'),
        handler: () => {
          ChooseImporterView.open({
            callback: (importer) => {
              FilesImporterView.open({
                importer: importer,
                folderPermaId: this.currentFolderPermaId()
              });
            }
          });
        }
      });
    }

    menuOptions.push({
      label: I18n.t('pageflow.editor.views.files_view.folder'),
      handler: this.addFolder.bind(this),
      separated: true
    });

    this.$el.append(this.subview(new DropDownButtonView({
      label: I18n.t('pageflow.editor.views.files_view.add'),
      items: this.addMenuItems(menuOptions),
      alignMenu: 'right',
      buttonClassName: 'manage_files-add'
    })).el);

    var fileTypes = this.fileTypes();

    if (fileTypes.length > 1) {
      this.fileTypeSelection = new FileTypeSelection({}, {
        storageKey: 'pageflow.files_view.file_types'
      });

      this.fileTypeSelection.select(this.selectedCollectionNames(fileTypes));

      if (this.options.selectionHandler) {
        this.listenTo(this.fileTypeSelection, 'change:collectionNames', function() {
          if (this.displaysUnselectableFileTypes()) {
            this.leaveSelectionMode();
          }
        });
      }
      else {
        this.watchFileTypesForRemovedFiles(fileTypes);
      }
    }

    var tabsView = new TabsView({
      i18n: 'pageflow.editor.views.files_view.tabs'
    });

    editor.setUploadFolder(this.currentFolder());

    tabsView.tab('files', () => new FilteredFilesView({
      entry: this.model,
      fileTypes: fileTypes,
      fileTypeSelection: this.fileTypeSelection,
      fileFolders: this.model.fileFolders,
      folder: this.currentFolder(),
      onSelectFolder: this.selectFolder.bind(this),
      onDismissSelection: this.leaveSelectionMode.bind(this),
      selectionHandler: this.options.selectionHandler,
      selectionFileType: this.selectionFileType(),
      filterName: this.options.filterName
    }));

    this.$el.append(this.subview(tabsView).el);
  },

  addMenuItems: function(menuOptions) {
    return new Backbone.Collection(menuOptions.map(function(option) {
      var item = new Backbone.Model({label: option.label, separated: option.separated});

      item.selected = option.handler;

      return item;
    }));
  },

  // Only a selection which is restricted to a single file type can be
  // named. Otherwise the requested type is merely a preselection.
  selectionFileType: function() {
    if (!this.options.selectionHandler || this.options.allowSelectingAny) {
      return;
    }

    return editor.fileTypes.findByCollectionName(this.options.fileTypeName);
  },

  // Folders which have been deleted in another editor session would
  // otherwise render an empty list without a way back.
  currentFolder: function() {
    return this.model.fileFolders.byPermaId(this.options.folderPermaId);
  },

  // Dropping handler and payload ends the selection request. The
  // current folder is kept, since ending it is not meant to undo the
  // navigation that led there.
  leaveSelectionMode: function() {
    var folder = this.currentFolder();

    editor.navigate(filesPath({folderPermaId: folder && folder.get('perma_id')}),
                    {trigger: true});
  },

  currentFolderPermaId: function() {
    var folder = this.currentFolder();

    return folder && folder.get('perma_id');
  },

  onClose: function() {
    Marionette.ItemView.prototype.onClose.call(this);

    editor.setUploadFolder(undefined);
  },

  // The folder is only persisted once the user has entered a name in the
  // row which appears for folders that have not been created yet.
  addFolder: function() {
    var folder = this.currentFolder();

    this.model.fileFolders.add({
      name: '',
      parent_folder_perma_id: folder ? folder.get('perma_id') : null
    });
  },

  selectFolder: function(folder) {
    editor.navigate(filesPath({
      ...this.options.pathParams,
      folderPermaId: folder && folder.get('perma_id')
    }), {trigger: true});
  },

  selectedCollectionNames: function(fileTypes) {
    if (this.options.fileTypeName) {
      return [this.options.fileTypeName];
    }

    return this.selectableCollectionNames(fileTypes);
  },

  // Selecting a file type which is no longer registered or has no files
  // would filter the list down to nothing while its pill is hidden.
  selectableCollectionNames: function(fileTypes) {
    var collectionNames = fileTypes.filter(function(fileType) {
      return this.model.getFileCollection(fileType).length > 0;
    }, this).map(function(fileType) {
      return fileType.collectionName;
    });

    return this.fileTypeSelection.get('collectionNames').filter(function(collectionName) {
      return collectionNames.includes(collectionName);
    });
  },

  watchFileTypesForRemovedFiles: function(fileTypes) {
    fileTypes.forEach(function(fileType) {
      this.listenTo(this.model.getFileCollection(fileType), 'remove', function() {
        this.fileTypeSelection.select(this.selectableCollectionNames(fileTypes));
      });
    }, this);
  },

  // Files of types the content element does not accept must not appear
  // selectable. Changing the pills leaves selection mode instead.
  displaysUnselectableFileTypes: function() {
    return !!this.options.selectionHandler &&
           !this.options.allowSelectingAny &&
           !this.fileTypeSelection.isOnlySelected(this.options.fileTypeName);
  },

  fileTypes: function() {
    // Filters are registered per file type, so a request for a filtered list
    // only ever concerns the single type it is registered for.
    if (this.options.filterName) {
      return [editor.fileTypes.findByCollectionName(this.options.fileTypeName)];
    }

    return editor.fileTypes.filter(function(fileType) {
      return fileType.topLevelType;
    });
  },

  // Entering a folder is a navigation step of its own, which the back
  // button undoes before leaving the files list.
  goBack: function() {
    var folder = this.currentFolder();

    if (folder) {
      return this.selectFolder(this.model.fileFolders.parentOf(folder));
    }

    if (this.options.selectionHandler) {
      editor.navigate(this.options.selectionHandler.getReferer(), {trigger: true});
    }
    else {
      editor.navigate('/', {trigger: true});
    }
  },

  upload: function() {
    app.trigger('request-upload');
  }
});
