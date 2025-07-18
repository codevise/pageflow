import Backbone from 'backbone';

import {TextTableCellView} from 'pageflow/ui';

import {UploadableFilesView, editor} from 'pageflow/editor';

import * as support from '$support';
import {Table} from '$support/dominos/ui';

describe('UploadableFilesView', () => {
  var f = support.factories;

  support.useFakeTranslations({
    'pageflow.entry_types.strange.editor.files.attributes.image_files.custom.column_header':
      'Entry Column',
    'pageflow.editor.files.attributes.image_files.custom.column_header': 'Fallback Column'
  });

  it('renders confirmUploadTableColumns of file type', () => {
    var fileType = f.fileType({
      confirmUploadTableColumns: [
        {name: 'custom', cellView: TextTableCellView}
      ]
    });
    var view = new UploadableFilesView({
      collection: f.filesCollection({
        fileType: fileType
      }),
      fileType: fileType,
      selection: new Backbone.Model()
    });

    view.render();
    var table = Table.find(view);

    expect(table.columnNames()).toEqual(expect.arrayContaining(['custom']));
  });

  it('uses entry type-specific translation keys if provided', () => {
    editor.registerEntryType('strange');
    var fileType = f.fileType({
      collectionName: 'image_files',
      confirmUploadTableColumns: [
        {name: 'custom', cellView: TextTableCellView}
      ]
    });
    var view = new UploadableFilesView({
      collection: f.filesCollection({fileType: fileType}),
      fileType: fileType,
      selection: new Backbone.Model()
    });

    view.render();

    expect(view.$el.find('th').eq(2)).toHaveText('Entry Column');
  });

  it('falls back to generic translation keys', () => {
    editor.registerEntryType('other');
    var fileType = f.fileType({
      collectionName: 'image_files',
      confirmUploadTableColumns: [
        {name: 'custom', cellView: TextTableCellView}
      ]
    });
    var view = new UploadableFilesView({
      collection: f.filesCollection({fileType: fileType}),
      fileType: fileType,
      selection: new Backbone.Model()
    });

    view.render();

    expect(view.$el.find('th').eq(2)).toHaveText('Fallback Column');
  });
});
