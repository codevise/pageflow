pageflow.ChapterPagesCollection = pageflow.SubsetCollection.extend({
  mixins: [pageflow.orderedCollection],

  constructor: function(options) {
    var chapter = options.chapter;

    pageflow.SubsetCollection.prototype.constructor.call(this, {
      parent: options.pages,
      parentModel: chapter,

      filter: function(item) {
        return !chapter.isNew() && item.get('chapter_id') === chapter.id;
      },

      comparator: function(item) {
        return item.get('position');
      }
    });

    this.each(function(page) {
      page.chapter = chapter;
    });

    this.listenTo(this, 'add', function(model) {
      model.chapter = chapter;
      model.set('chapter_id', chapter.id);

      pageflow.editor.trigger('add:page', model);
    });

    this.listenTo(this, 'remove', function(model) {
      model.chapter = null;
    });

    this.listenTo(chapter, 'destroy', function() {
      this.clear();
    });
  }
});
