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
import {SelectButtonView} from './SelectButtonView';

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
        handler: function() {
          FilesExplorerView.open({
            callback: function(otherEntry, file) {
              state.entry.reuseFile(otherEntry, file);
            }
          });
        }
      }
    ]
    if(editor.fileImporters.keys().length > 0){
      menuOptions.push({
        label: I18n.t('pageflow.editor.views.files_view.import'),
        handler: function () {
          ChooseImporterView.open({
            callback: function (importer) {
              FilesImporterView.open({
                importer: importer
              });
            }
          });
        }
      });
    }

    this.addFileModel = new Backbone.Model({
      label: I18n.t('pageflow.editor.views.files_view.add'),
      options: menuOptions
    });

    this.$el.append(this.subview(new SelectButtonView({model: this.addFileModel })).el);

    var fileTypes = this.fileTypes();

    if (fileTypes.length > 1) {
      this.fileTypeSelection = new FileTypeSelection({}, {
        storageKey: 'pageflow.files_view.file_types'
      });

      this.fileTypeSelection.select(this.selectedCollectionNames(fileTypes));

      if (this.options.selectionHandler) {
        this.listenTo(this.fileTypeSelection, 'change:collectionNames', function() {
          if (this.displaysUnselectableFileTypes()) {
            editor.navigate('/files', {trigger: true});
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

    tabsView.tab('files', () => new FilteredFilesView({
      entry: this.model,
      fileTypes: fileTypes,
      fileTypeSelection: this.fileTypeSelection,
      selectionHandler: this.options.selectionHandler,
      selectionFileType: this.selectionFileType(),
      filterName: this.options.filterName
    }));

    this.$el.append(this.subview(tabsView).el);
  },

  // Only a selection which is restricted to a single file type can be
  // named. Otherwise the requested type is merely a preselection.
  selectionFileType: function() {
    if (!this.options.selectionHandler || this.options.allowSelectingAny) {
      return;
    }

    return editor.fileTypes.findByCollectionName(this.options.fileTypeName);
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

  goBack: function() {
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
