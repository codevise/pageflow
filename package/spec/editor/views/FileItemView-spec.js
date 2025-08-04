import {FileItemView, FileMetaDataItemValueView} from 'pageflow/editor';

import * as support from '$support';
import {FileMetaDataTable} from '$support/dominos/editor';
import {within} from '@testing-library/dom';

describe('FileItemView', () => {
  support.useFakeTranslations({
    'pageflow.editor.templates.file_item.expand_details': 'Show details',
    'pageflow.editor.templates.file_item.collapse_details': 'Hide details',
    'pageflow.editor.templates.file_item.download': 'Download'
  });

  it('displays file title', () => {
    const file = support.factories.file({file_name: 'original.png'});

    const view = new FileItemView({model: file});

    const {getByText} = within(view.render().el);

    expect(getByText('original.png')).not.toBeNull();
  });

  it('links to download_url', () => {
    const file = support.factories.file({
      original_url: '/path/file.png',
      display_name: 'My File',
      state: 'processed'
    });

    const view = new FileItemView({model: file});

    view.render();
    const {getByRole} = within(view.el);
    const link = getByRole('link', {name: 'Download'});

    expect(link.getAttribute('href'))
      .toBe('/path/file.png?download=My%20File');
  });

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

  it('sets up proper ARIA attributes for expand/collapse', () => {
    var file = support.factories.file({id: 123});
    var fileItemView = new FileItemView({
      model: file,
      metaDataAttributes: []
    });

    const {getByRole} = within(fileItemView.render().el);

    var thumbnailButton = getByRole('button', {name: 'Show details'});
    var detailsDiv = getByRole('table', {hidden: true}).closest('.details');

    expect(thumbnailButton.getAttribute('aria-expanded')).toBe('false');
    expect(thumbnailButton.getAttribute('aria-controls')).toBe('file-details-123');
    expect(detailsDiv.getAttribute('id')).toBe('file-details-123');
  });
});
