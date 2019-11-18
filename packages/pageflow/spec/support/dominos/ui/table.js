support.dom.Table = support.dom.Base.extend({
  selector: '.table_view',

  columnNames: function() {
    return this.$el.find('th').map(function() {
      return $(this).data('columnName');
    }).get();
  }
});
