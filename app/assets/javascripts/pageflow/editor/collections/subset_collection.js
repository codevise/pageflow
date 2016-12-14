pageflow.SubsetCollection = Backbone.Collection.extend({
  constructor: function(options) {
    var adding = false;

    options = options || {};

    this.filter = options.filter || function(item) { return true; };
    this.parent = options.parent;
    this.parentModel = options.parentModel;

    delete options.filter;
    delete options.parent;

    this.model = this.parent.model;
    this.comparator = options.comparator || this.parent.comparator;

    this.listenTo(this.parent, 'add', function(model, collection, options) {
      if (!adding && this.filter(model)) {
        this.add(model, options);
      }
    });

    this.listenTo(this.parent, 'remove', function(model) {
      this.remove(model);
    });

    this.listenTo(this, 'add', function(model, collection, options) {
      adding = true;
      this.parent.add(model);
      adding = false;
    });

    if (options.watchAttribute) {
      this.listenTo(this.parent, 'change:' + options.watchAttribute, function(model) {
        if (this.filter(model)) {
          this.add(model);
        }
        else {
          this.remove(model);
        }
      });
    }

    this.listenTo(this, 'sort', function() {
      this.parent.sort();
    });

    Backbone.Collection.prototype.constructor
      .call(this, this.parent.filter(this.filter, this), options);
  },

  clear: function() {
    this.parent.remove(this.models);
    this.reset();
  },

  url: function() {
    return this.parentModel.url() + _.result(this.parent, 'url');
  },

  dispose: function() {
    this.stopListening();
    this.reset();
  }
});
