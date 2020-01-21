import Marionette from 'backbone.marionette';

import {CollectionView} from 'pageflow/ui';

import {WidgetItemView} from './WidgetItemView';

import template from '../templates/editWidgets.jst';

export const EditWidgetsView = Marionette.Layout.extend({
  template,

  ui: {
    widgets: '.widgets'
  },

  onRender: function() {
    this.subview(new CollectionView({
      el: this.ui.widgets,
      collection: this.model.widgets,
      itemViewConstructor: WidgetItemView,
      itemViewOptions: {
        widgetTypes: this.options.widgetTypes
      }
    }).render());
  }
});