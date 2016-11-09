pageflow.TableView = Backbone.Marionette.ItemView.extend({
  tagName: 'table',
  className: 'table_view',
  template: 'pageflow/ui/templates/table',

  ui: {
    headRow: 'thead tr',
    body: 'tbody'
  },

  onRender: function() {
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
        template: function() {
          return this.options.blankSlateText;
        }.bind(this)
      })
    }));
  }
});
