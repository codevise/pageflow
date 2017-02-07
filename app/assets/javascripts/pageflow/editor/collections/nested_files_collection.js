pageflow.NestedFilesCollection = pageflow.SubsetCollection.extend({
  constructor: function(options) {
    var parent = options.parent;
    var parentFile = options.parentFile;

    var modelType = parentFile.fileType().typeName;
    var nestedFilesOrder = parent.fileType.nestedFilesOrder;

    pageflow.SubsetCollection.prototype.constructor.call(this, {
      parent: parent,
      parentModel: parentFile,

      filter: function(item) {
        return item.get('parent_file_id') === parentFile.get('id') &&
          item.get('parent_file_model_type') === modelType;
      },

      comparator: nestedFilesOrder && nestedFilesOrder.comparator
    });

    if (nestedFilesOrder) {
      this.listenTo(this,
                    'change:configuration:' + nestedFilesOrder.binding,
                    this.sort);
    }
  }
});