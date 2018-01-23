pageflow.transientReferences = {
  initialize: function() {
    this.transientReferences = {};
    this.pendingReferences = {};
  },

  getReference: function(attribute, collection) {
    if (typeof collection === 'string') {
      var fileType = pageflow.editor.fileTypes.findByCollectionName(collection);
      collection = pageflow.entry.getFileCollection(fileType);
    }

    return this.transientReferences[attribute] ||
      collection.get(this.get(attribute));
  },

  setReference: function(attribute, record) {
    this._cleanUpReference(attribute);
    this._setReference(attribute, record);
    this._listenForReady(attribute, record);
  },

  unsetReference: function(attribute) {
    this._cleanUpReference(attribute);
    this.set(attribute, null);
  },

  _setReference: function(attribute, record) {
    if (record.isNew()) {
      this.transientReferences[attribute] = record;
      this.set(attribute, null);
      this._setIdOnceSynced(attribute, record);
    }
    else {
      this.set(attribute, record.id);
    }
  },

  _setIdOnceSynced: function(attribute, record) {
    record.once('change:id', function() {
      this._onceRecordCanBeFoundInCollection(record, function() {
        delete this.transientReferences[attribute];
        this.set(attribute, record.id);
      });
    }, this);
  },

  _onceRecordCanBeFoundInCollection: function(record, callback) {
    // Backbone collections update their modelsById map in the change
    // event which is dispatched after the `change:<attribute>`
    // events.
    record.once('change', _.bind(callback, this));
  },

  _listenForReady: function(attribute, record) {
    if (!record.isReady()) {
      this.pendingReferences[attribute] = record;

      this.listenTo(record, 'change:state', function() {
        if (record.isReady()) {
          this._cleanUpReadyListener(attribute);
          this.trigger('change');
          this.trigger('change:' + attribute + ':ready');
        }
      });
    }
  },

  _cleanUpReference: function(attribute) {
    this._cleanUpSaveListener(attribute);
    this._cleanUpReadyListener(attribute);
  },

  _cleanUpSaveListener: function(attribute) {
    if (this.transientReferences[attribute]) {
      this.stopListening(this.transientReferences[attribute], 'change:id');
      delete this.transientReferences[attribute];
    }
  },

  _cleanUpReadyListener: function(attribute) {
    if (this.pendingReferences[attribute]) {
      this.stopListening(this.pendingReferences[attribute], 'change:state');
      delete this.pendingReferences[attribute];
    }
  }
};