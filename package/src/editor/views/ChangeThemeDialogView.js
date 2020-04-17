import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import {CollectionView} from 'pageflow/ui';

import {app} from '../app';

import {LoadingView} from './LoadingView';
import {ThemeItemView} from './ThemeItemView';
import {dialogView} from './mixins/dialogView';

import template from '../templates/changeThemeDialog.jst';

export const ChangeThemeDialogView = Marionette.ItemView.extend({
  template,
  className: 'change_theme dialog editor',

  mixins: [dialogView],

  ui: {
    content: '.content',
    themesPanel: '.themes_panel',
    previewPanel: '.preview_panel',
    previewImageRegion: '.preview_image_region',
    previewImage: '.preview_image',
    previewHeaderThemeName: '.preview_header_theme_name'
  },

  initialize: function(options) {
    this.selection = new Backbone.Model();
    var themeInUse = this.options.themes.findByName(this.options.themeInUse);
    this.selection.set('theme', themeInUse);
    this.listenTo(this.selection, 'change:theme', function() {
      if (!this.selection.get('theme')) {
        this.selection.set('theme', themeInUse);
      }
      this.update();
    });
  },

  onRender: function() {
    var themes = this.options.themes;
    this.themesView = new CollectionView({
      collection: themes,
      tagName: 'ul',
      itemViewConstructor: ThemeItemView,
      itemViewOptions: {
        selection: this.selection,
        onUse: this.options.onUse,
        themes: themes,
        themeInUse: this.options.themeInUse
      }
    });

    this.ui.themesPanel.append(this.subview(this.themesView).el);

    this.ui.previewPanel.append(this.subview(new LoadingView({tagName: 'div'})).el);

    this.update();
  },

  update: function() {
    var that = this;
    var selectedTheme = this.options.themes.findByName(that.selection.get('theme').get('name'));
    this.ui.previewImage.hide();
    this.ui.previewImage.one('load', function() {
      $(this).show();
    });
    this.ui.previewImage.attr('src', selectedTheme.get('preview_image_url'));
    this.ui.previewHeaderThemeName.text(selectedTheme.title());
  }
});

ChangeThemeDialogView.changeTheme = function(options) {
  return $.Deferred(function(deferred) {
    options.onUse = function(theme) {
      deferred.resolve(theme);
      view.close();
    };

    var view = new ChangeThemeDialogView(options);

    view.on('close', function() {
      deferred.reject();
    });

    app.dialogRegion.show(view.render());
  }).promise();
};
