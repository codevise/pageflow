import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {CollectionView} from './CollectionView';
import {TableHeaderCellView} from './tableCells/TableHeaderCellView';
import {TableRowView} from './TableRowView';

import template from '../templates/table.jst';
import blankSlateTemplate from '../templates/tableBlankSlate.jst';

export const TableView = Marionette.ItemView.extend({
  tagName: 'table',
  className: 'table_view',
  template,

  ui: {
    headRow: 'thead tr',
    body: 'tbody'
  },

  onRender: function() {
    var view = this;

    _(this.options.columns).each(function(column) {
      this.ui.headRow.append(this.subview(new TableHeaderCellView({
        column: column,
        attributeTranslationKeyPrefixes: this.options.attributeTranslationKeyPrefixes
      })).el);
    }, this);

    this.subview(new CollectionView({
      el: this.ui.body,
      collection: this.collection,

      itemViewConstructor: TableRowView,
      itemViewOptions: {
        columns: this.options.columns,
        selection: this.options.selection,
        selectionAttribute: this.options.selectionAttribute,
        attributeTranslationKeyPrefixes: this.options.attributeTranslationKeyPrefixes
      },

      blankSlateViewConstructor: Marionette.ItemView.extend({
        tagName: 'tr',
        className: 'blank_slate',
        template: blankSlateTemplate,

        serializeData: function() {
          return {
            blankSlateText: view.options.blankSlateText,
            colSpan: view.options.columns.length
          };
        }
      })
    }));
  }
});
