import Backbone from 'backbone';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {TabsView} from '$pageflow/ui';

import {app} from '../app';
import {editor} from '../base';

import {FilesExplorerView} from './FilesExplorerView';
import {FilteredFilesView} from './FilteredFilesView';
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
    
    this.addFileModel = new Backbone.Model({
      label: I18n.t('pageflow.editor.views.files_view.add'),
      options: [
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
        },
        {
          label: I18n.t('pageflow.editor.views.files_view.import'),
          handler: function () {
            pageflow.ChooseImporterView.open({
              callback: function (importer_key) {
                pageflow.FilesImporterView.open({
                  importer_key: importer_key
                });
              }
            });
          }
        }
      ]
    });

    this.$el.append(this.subview(new SelectButtonView({model: this.addFileModel })).el);

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

    this.$el.append(this.subview(this.tabsView).el);
  },

  tab: function(fileType) {
    var selectionMode = this.options.tabName === fileType.collectionName;

    this.tabsView.tab(fileType.collectionName, _.bind(function() {
      return this.subview(new FilteredFilesView({
        entry: state.entry,
        fileType: fileType,
        selectionHandler: selectionMode && this.options.selectionHandler,
        filterName: selectionMode && this.options.filterName
      }));
    }, this));

    this.listenTo(this.model, 'change:uploading_' + fileType.collectionName +'_count', function(model, value) {
      this.tabsView.toggleSpinnerOnTab(fileType.collectionName, value > 0);
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
