support.dom.Tabs = support.dom.Base.extend({
  selector: '.tabs_view',

  tabNames: function() {
    return this.$el.find('[data-tab-name]').map(function() {
      return $(this).data('tabName');
    }).get();
  }
});
