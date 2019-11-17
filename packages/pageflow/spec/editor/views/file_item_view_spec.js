describe('FileItemView', function() {
  it('renders meta data items given as string', function() {
    var file = support.factories.file(
      {dimension: '200x100px'}
    );
    var fileItemView = new pageflow.FileItemView({
      model: file,
      metaDataAttributes: ['dimension']
    });

    fileItemView.render();
    var fileMetaDataTable = support.dom.FileMetaDataTable.find(fileItemView);

    expect(fileMetaDataTable.values()).include('200x100px');
  });

  it('renders meta data items with custom view and options', function() {
    var file = support.factories.file(
      {dimension: '200x100px'}
    );
    var fileItemView = new pageflow.FileItemView({
      model: file,
      metaDataAttributes: [
        {
          name: 'dimension',
          valueView: pageflow.FileMetaDataItemValueView.extend({
            getText: function() {
              return this.model.get(this.options.name) + this.options.suffix;
            }
          }),
          valueViewOptions: {
            suffix: '!!'
          }
        }
      ]
    });

    fileItemView.render();
    var fileMetaDataTable = support.dom.FileMetaDataTable.find(fileItemView);

    expect(fileMetaDataTable.values()).include('200x100px!!');
  });
});