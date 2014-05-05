pageflow.EditEntryView = Backbone.Marionette.ItemView.extend({
  template: 'templates/edit_entry',

  mixins: [pageflow.failureIndicatingView],

  ui: {
    publicationStateButton: 'a.publication_state'
  },

  events: {
    'click a.close': function() {
      $.when(pageflow.editLock.release()).then(function() {
        window.location = '/admin/entries/' + pageflow.entry.id;
      });
    },

    'click a.publish': function() {
      editor.navigate('/publish', {trigger: true});
      return false;
    },

    'click a.edit_entry_meta_data': function() {
      editor.navigate('/meta_data', {trigger: true});
      return false;
    },

    'click a.manage_files': function() {
      editor.navigate('/files', {trigger: true});
      return false;
    },

    'click a.add_chapter': function() {
      this.model.addChapter();
    }
  },

  onRender: function() {
    this.subview(new pageflow.SortableCollectionView({
      el: this.$('ul.chapters'),
      collection: this.model.chapters,
      itemViewConstructor: pageflow.NavigatableChapterItemView,
      itemViewOptions: {
        pageItemViewOptions: {
          displayInNavigationHint: true
        }
      }
    }));
  }
});