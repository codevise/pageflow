describe('FileItemView', () => {
  test('renders meta data items given as string', () => {
    var file = support.factories.file(
      {dimension: '200x100px'}
    );
    var fileItemView = new pageflow.FileItemView({
      model: file,
      metaDataAttributes: ['dimension']
    });

    fileItemView.render();
    var fileMetaDataTable = support.dom.FileMetaDataTable.find(fileItemView);

    expect(fileMetaDataTable.values()).toEqual(expect.arrayContaining(['200x100px']));
  });

  test('renders meta data items with custom view and options', () => {
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

    expect(fileMetaDataTable.values()).toEqual(expect.arrayContaining(['200x100px!!']));
  });
});