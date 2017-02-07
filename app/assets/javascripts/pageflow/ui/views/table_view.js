pageflow.TableView = Backbone.Marionette.ItemView.extend({
  tagName: 'table',
  className: 'table_view',
  template: 'pageflow/ui/templates/table',

  ui: {
    headRow: 'thead tr',
    body: 'tbody'
  },

  onRender: function() {
    var view = this;

    _(this.options.columns).each(function(column) {
      this.ui.headRow.append(this.subview(new pageflow.TableHeaderCellView({
        column: column,
        attributeTranslationKeyPrefixes: this.options.attributeTranslationKeyPrefixes
      })).el);
    }, this);

    this.subview(new pageflow.CollectionView({
      el: this.ui.body,
      collection: this.collection,

      itemViewConstructor: pageflow.TableRowView,
      itemViewOptions: {
        columns: this.options.columns,
        selection: this.options.selection,
        selectionAttribute: this.options.selectionAttribute,
        attributeTranslationKeyPrefixes: this.options.attributeTranslationKeyPrefixes
      },

      blankSlateViewConstructor: Backbone.Marionette.ItemView.extend({
        tagName: 'tr',
        className: 'blank_slate',
        template: 'pageflow/ui/templates/table_blank_slate',

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
