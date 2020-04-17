import {FileItemView, FileMetaDataItemValueView} from 'pageflow/editor';

import * as support from '$support';
import {FileMetaDataTable} from '$support/dominos/editor';

describe('FileItemView', () => {
  it('renders meta data items given as string', () => {
    var file = support.factories.file(
      {dimension: '200x100px'}
    );
    var fileItemView = new FileItemView({
      model: file,
      metaDataAttributes: ['dimension']
    });

    fileItemView.render();
    var fileMetaDataTable = FileMetaDataTable.find(fileItemView);

    expect(fileMetaDataTable.values()).toEqual(expect.arrayContaining(['200x100px']));
  });

  it('renders meta data items with custom view and options', () => {
    var file = support.factories.file(
      {dimension: '200x100px'}
    );
    var fileItemView = new FileItemView({
      model: file,
      metaDataAttributes: [
        {
          name: 'dimension',
          valueView: FileMetaDataItemValueView.extend({
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
    var fileMetaDataTable = FileMetaDataTable.find(fileItemView);

    expect(fileMetaDataTable.values()).toEqual(expect.arrayContaining(['200x100px!!']));
  });
});