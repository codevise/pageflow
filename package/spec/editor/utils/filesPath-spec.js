import {filesPath} from 'pageflow/editor';

describe('filesPath', () => {
  it('returns files path without params', () => {
    expect(filesPath()).toEqual('/files');
  });

  it('includes collection name', () => {
    expect(filesPath({collectionName: 'image_files'})).toEqual('/files/image_files');
  });

  it('includes folder perma id', () => {
    expect(filesPath({folderPermaId: 5})).toEqual('/files/folders/5');
  });

  it('includes collection name and folder perma id', () => {
    expect(filesPath({collectionName: 'image_files', folderPermaId: 5}))
      .toEqual('/files/image_files/folders/5');
  });

  it('includes selection handler and payload', () => {
    expect(filesPath({handler: 'some_handler', payload: '{"some":"value"}'}))
      .toEqual('/files?handler=some_handler&payload=%7B%22some%22%3A%22value%22%7D');
  });

  it('includes filter name only together with handler', () => {
    expect(filesPath({
      collectionName: 'image_files',
      handler: 'some_handler',
      payload: '{}',
      filterName: 'large'
    })).toEqual('/files/image_files?handler=some_handler&payload=%7B%7D&filter=large');
  });

  it('omits filter name without handler', () => {
    expect(filesPath({collectionName: 'image_files', filterName: 'large'}))
      .toEqual('/files/image_files');
  });

  it('keeps handler and payload when navigating into folder', () => {
    expect(filesPath({
      collectionName: 'image_files:default',
      folderPermaId: 5,
      handler: 'some_handler',
      payload: '{}'
    })).toEqual('/files/image_files:default/folders/5?handler=some_handler&payload=%7B%7D');
  });
});
