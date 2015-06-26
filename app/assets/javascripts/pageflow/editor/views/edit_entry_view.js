pageflow.EditEntryView = Backbone.Marionette.ItemView.extend({
  template: 'templates/edit_entry',

  mixins: [pageflow.failureIndicatingView],

  ui: {
    publicationStateButton: 'a.publication_state',
    menu: '.menu'
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

    'click a.add_chapter': function() {
      this.model.addChapter();
    },

    'click .menu a': function(event) {
      editor.navigate($(event.target).data('path'), {trigger: true});
      return false;
    }
  },

  onRender: function() {
    this._addMenuItems();

    this.subview(new pageflow.SortableCollectionView({
      el: this.$('ul.chapters'),
      collection: this.model.chapters,
      itemViewConstructor: pageflow.NavigatableChapterItemView,
      itemViewOptions: {
        sortable: true,
        pageItemViewOptions: {
          displayInNavigationHint: true
        }
      }
    }));
  },

  _addMenuItems: function() {
    var view = this;

    _.each(pageflow.editor.mainMenuItems, function(options) {
      var item = $('<li><a href="#"></a></li>');
      var link = item.find('a');

      if (options.path) {
        link.data('path', options.path);
      }
      link.text(I18n.t(options.translationKey));

      if (options.click) {
        $(link).click(options.click);
      }


      view.ui.menu.append(item);
    });
  }
});
