import {LinkToFileView} from 'editor/views/LinkToFileView';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories, normalizeSeed} from 'support';
import {useFakeTranslations, renderBackboneView as render} from 'pageflow/testHelpers';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

describe('LinkToFileView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.select_link_destination.file': 'File',
    'pageflow_scrolled.editor.select_link_destination.no_file_selected': 'No file selected',
    'pageflow_scrolled.editor.select_link_destination.select_in_sidebar': 'Select file'
  });

  it('displays hint if no file is selected', () => {
    const view = new LinkToFileView({onSelectFile: jest.fn()});

    const {getByText} = render(view);

    expect(getByText('No file selected')).toBeInTheDocument();
  });

  it('displays title of selected file', () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed(),
      fileTypes: factories.fileTypesWithImageFileType(),
      filesAttributes: {
        image_files: [{id: 1, perma_id: 10, file_name: 'report.jpg'}]
      }
    });
    const file = entry.getFileCollection('image_files').get(1);
    const view = new LinkToFileView({file, onSelectFile: jest.fn()});

    const {getByText, queryByText} = render(view);

    expect(getByText('report.jpg')).toBeInTheDocument();
    expect(queryByText('No file selected')).toBeNull();
  });

  it('calls onSelectFile when button is clicked', async () => {
    const listener = jest.fn();
    const view = new LinkToFileView({onSelectFile: listener});

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Select file'}));

    expect(listener).toHaveBeenCalled();
  });
});
