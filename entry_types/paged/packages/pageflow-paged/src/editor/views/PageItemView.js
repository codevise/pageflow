import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {editor, PageThumbnailView} from 'pageflow/editor';

import template from '../templates/pageItem.jst';

export const PageItemView = Marionette.ItemView.extend({
  tagName: 'li',
  template,

  ui: {
    title: '.title',
    pictogram: '.type_pictogram',
    pageThumbnail: '.page_thumbnail'
  },

  modelEvents: {
    'change:title': 'update',
    'change:active': 'update'
  },

  onRender: function() {
    this.subview(new PageThumbnailView({
      el: this.ui.pageThumbnail,
      model: this.model
    }));

    this.update();
  },

  update: function() {
    this.$el.attr('data-id', this.model.id);
    this.$el.attr('data-perma-id', this.model.get('perma_id'));

    this.$el.toggleClass('active', this.model.get('active'));
    this.$el.toggleClass('disabled',
                         !!(this.options.isDisabled && this.options.isDisabled(this.model)));
    this.$el.toggleClass('display_in_navigation', !!this.model.configuration.get('display_in_navigation'));
    this.$el
      .removeClass(editor.pageTypes.pluck('name').join(' '))
      .addClass(this.model.get('template'));

    this.ui.pictogram.attr('title', this._getPictogramTitle());
    this.ui.title.text(this.model.title() || I18n.t('pageflow.editor.views.page_item_view.unnamed'));
  },

  _getPictogramTitle: function() {
    var result = I18n.t(this.model.pageType().translationKey());
    result += ' Seite';

    if (this.options.displayInNavigationHint && !this.model.configuration.get('display_in_navigation')) {
      result += ' (nicht in Navigationsleiste)';
    }

    return result;
  }
});
