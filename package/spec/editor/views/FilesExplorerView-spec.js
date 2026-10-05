import {FilesExplorerView, editor} from 'pageflow/editor';

import * as support from '$support';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {renderBackboneView as render} from 'pageflow/testHelpers';

import {state} from '$state';

describe('FilesExplorerView', () => {
  const f = support.factories;

  let testContext;

  beforeEach(() => {
    testContext = {};
  });

  support.useFakeXhr(() => testContext);

  beforeEach(() => {
    editor.fileTypes = f.fileTypes(function() {
      this.withImageFileType();
    });
    state.entry = f.entry({id: 1}, {fileTypes: editor.fileTypes, filesAttributes: {}});
  });

  afterEach(() => {
    state.entry = null;
  });

  function respondWithOtherEntryFiles(files) {
    testContext.server.respondWith('GET', '/editor/entries',
                                   [200, {'Content-Type': 'application/json'},
                                    JSON.stringify([{id: 2, title: 'Other'}])]);
    testContext.server.respondWith('GET', '/editor/entries/2/files/image_files',
                                   [200, {'Content-Type': 'application/json'},
                                    JSON.stringify(files)]);
  }

  it('displays details of selected file', async () => {
    respondWithOtherEntryFiles([{id: 5, file_name: 'other.png', state: 'processed'}]);
    const user = userEvent.setup();
    const view = new FilesExplorerView({});

    const {findByText, getByRole} = render(view);
    testContext.server.respond();
    testContext.server.respond();
    await user.click(await findByText('other.png'));

    expect(getByRole('heading', {name: 'other.png'})).not.toBeNull();
  });
});
