pageflow.ConfigurationEditorView.register('internal_links', {
  configure: function() {
    this.tab('general', function() {
      this.group('general');
    });

    this.tab('files', function() {
      this.input('background_image_id', pageflow.FileInputView, {collection: pageflow.imageFiles});
      this.input('thumbnail_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        positioning: false
      });
    });

    this.tab('links', function() {
      this.input('linked_pages_layout', pageflow.SelectInputView, {values: pageflow.Page.linkedPagesLayouts});
      this.input('linked_page_ids', pageflow.PageReferenceInputView);
    });

    this.tab('options', function() {
      this.group('options');
    });
  }
});