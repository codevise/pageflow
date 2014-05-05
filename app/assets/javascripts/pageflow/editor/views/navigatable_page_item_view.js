pageflow.NavigatablePageItemView = pageflow.PageItemView.extend({
  mixins: [pageflow.loadable, pageflow.failureIndicatingView],

  events: {
    'click': function() {
      if (!this.model.isNew() && !this.model.isDestroying()) {
        editor.navigate('/pages/' + this.model.get('id'), {trigger: true});
      }
      return false;
    }
  }
});