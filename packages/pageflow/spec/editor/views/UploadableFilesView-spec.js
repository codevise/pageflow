describe('UploadableFilesView', () => {
  var f = support.factories;

  test('renders confirmUploadTableColumns of file type', () => {
    var fileType = f.fileType({
      confirmUploadTableColumns: [
        {name: 'custom', cellView: pageflow.TextTableCellView}
      ]
    });
    var view = new pageflow.UploadableFilesView({
      collection: f.filesCollection({
        fileType: fileType
      }),
      fileType: fileType,
      selection: new Backbone.Model()
    });

    view.render();
    var table = support.dom.Table.find(view);

    expect(table.columnNames()).toEqual(expect.arrayContaining(['custom']));
  });
});
