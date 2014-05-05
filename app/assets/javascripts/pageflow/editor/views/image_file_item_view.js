pageflow.ImageFileItemView = pageflow.FileItemView.extend({
  metaDataViews: function() {
    return [
      new pageflow.FileMetaDataItemView({
        model: this.model,
        attribute: 'dimensions'
      })
    ];
  }
});