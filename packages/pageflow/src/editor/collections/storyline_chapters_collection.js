pageflow.StorylineChaptersCollection = pageflow.SubsetCollection.extend({
  mixins: [pageflow.orderedCollection],

  constructor: function(options) {
    var storyline = options.storyline;

    pageflow.SubsetCollection.prototype.constructor.call(this, {
      parent: options.chapters,
      parentModel: storyline,

      filter: function(item) {
        return !storyline.isNew() && item.get('storyline_id') === storyline.id;
      },

      comparator: function(item) {
        return item.get('position');
      }
    });

    this.each(function(chapter) {
      chapter.storyline = storyline;
    });

    this.listenTo(this, 'add', function(model) {
      model.storyline = storyline;
      model.set('storyline_id', storyline.id);

      pageflow.editor.trigger('add:chapter', model);
    });

    this.listenTo(this, 'remove', function(model) {
      model.storyline = null;
    });
  }
});
