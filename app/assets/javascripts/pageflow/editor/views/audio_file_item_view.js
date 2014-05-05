pageflow.AudioFileItemView = pageflow.FileItemView.extend({
  metaDataViews: function() {
    return [
      new pageflow.FileMetaDataItemView({
        model: this.model,
        attribute: 'format'
      }),
      new pageflow.FileMetaDataItemView({
        model: this.model,
        attribute: 'duration'
      })
    ];
  }
});