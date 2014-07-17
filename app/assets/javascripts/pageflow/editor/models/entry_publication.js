pageflow.EntryPublication = Backbone.Model.extend({
  paramRoot: 'entry_publication',

  quota: function() {
    return new Backbone.Model(this.get('quota') || {});
  },

  check: function() {
    var model = this;
    this.set('checking', true);

    this.save({}, {
      url: this.url() + '/check',
      success: function() {
        model.set('checking', false);
      },
      error: function() {
        model.set('checking', false);
      }
    });
  },

  publish: function(attributes) {
    var model = this;

    return this.save(attributes, {
      success: function(model) {
        pageflow.entry.parse(model.get('entry'));
      },

      error: function(model, xhr) {
        model.set(xhr.responseJSON);
      }
    });
  },

  url: function() {
    return '/editor/entries/' + pageflow.entry.get('id') + '/entry_publications';
  }
});