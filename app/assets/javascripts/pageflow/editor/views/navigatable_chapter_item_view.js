pageflow.NavigatableChapterItemView = pageflow.ChapterItemView.extend({
  mixins: [pageflow.loadable, pageflow.failureIndicatingView],

  events: {
    'click a.add_page': function() {
      this.model.addPage();
    },

    'click a.edit_chapter': function() {
      if (!this.model.isNew() && !this.model.isDestroying()) {
        editor.navigate('/chapters/' + this.model.get('id'), {trigger: true});
      }
      return false;
    }
  }
});