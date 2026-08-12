import {FileTypePillsView, FileTypeSelection} from 'pageflow/editor';

import * as support from '$support';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('FileTypePillsView', () => {
  const f = support.factories;

  support.useFakeTranslations({
    'pageflow.editor.files.tabs.image_files': 'Images',
    'pageflow.editor.files.tabs.video_files': 'Videos',
    'pageflow.editor.views.file_type_pills_view.group_label': 'Filter by file type',
    'pageflow.editor.views.file_type_pills_view.hint':
      'Click a file type to show only its files. Hold Ctrl/Cmd to combine file types.'
  });

  function setup({filesAttributes} = {}) {
    const fileTypes = f.fileTypes(function() {
      this.withImageFileType();
      this.withVideoFileType();
      this.withTextTrackFileType();
    });
    const entry = f.entry({}, {
      fileTypes,
      filesAttributes: filesAttributes || {
        image_files: [{id: 1, display_name: 'image.png'}],
        video_files: [{id: 1, display_name: 'video.mp4'}]
      }
    });

    return {
      entry,
      fileTypes: [
        fileTypes.findByCollectionName('image_files'),
        fileTypes.findByCollectionName('video_files')
      ]
    };
  }

  it('renders a pill for each file type', () => {
    const {entry, fileTypes} = setup();

    const view = new FileTypePillsView({
      entry,
      fileTypes,
      fileTypeSelection: new FileTypeSelection()
    });

    const {getAllByRole} = render(view);

    expect(getAllByRole('button').map(button => button.textContent.trim()))
      .toEqual(['Images', 'Videos']);
  });

  it('labels the group of pills', () => {
    const {entry, fileTypes} = setup();

    const view = new FileTypePillsView({
      entry,
      fileTypes,
      fileTypeSelection: new FileTypeSelection()
    });

    const {getByRole} = render(view);

    expect(getByRole('group', {name: 'Filter by file type'})).not.toBeNull();
  });

  it('marks pills of selected file types as pressed', () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    fileTypeSelection.toggle('video_files');

    expect(getByRole('button', {name: 'Videos'})).toHaveAttribute('aria-pressed', 'true');
    expect(getByRole('button', {name: 'Images'})).toHaveAttribute('aria-pressed', 'false');
  });

  it('renders no pill for file type without files', () => {
    const {entry, fileTypes} = setup({
      filesAttributes: {image_files: [{id: 1, display_name: 'image.png'}]}
    });

    const view = new FileTypePillsView({
      entry,
      fileTypes,
      fileTypeSelection: new FileTypeSelection()
    });

    const {queryByRole} = render(view);

    expect(queryByRole('button', {name: 'Videos'})).toBeNull();
  });

  it('renders pill once first file of its type is added', () => {
    const {entry, fileTypes} = setup({
      filesAttributes: {image_files: [{id: 1, display_name: 'image.png'}]}
    });

    const view = new FileTypePillsView({
      entry,
      fileTypes,
      fileTypeSelection: new FileTypeSelection()
    });

    const {queryByRole} = render(view);
    entry.getFileCollection('video_files').add({id: 1, display_name: 'video.mp4'});

    expect(queryByRole('button', {name: 'Videos'})).not.toBeNull();
  });

  it('renders nothing while no files are present', () => {
    const {entry, fileTypes} = setup({filesAttributes: {}});

    const view = new FileTypePillsView({
      entry,
      fileTypes,
      fileTypeSelection: new FileTypeSelection()
    });

    const {queryByRole} = render(view);

    expect(queryByRole('group', {name: 'Filter by file type'})).toBeNull();
  });

  describe('with files of only one type', () => {
    function setupOneType() {
      const {entry, fileTypes} = setup({
        filesAttributes: {image_files: [{id: 1, display_name: 'image.png'}]}
      });
      const fileTypeSelection = new FileTypeSelection();

      const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

      return {view, entry, fileTypeSelection, queries: render(view)};
    }

    it('renders the pill of that type as pressed', () => {
      const {queries} = setupOneType();

      expect(queries.getByRole('button', {name: 'Images'}))
        .toHaveAttribute('aria-pressed', 'true');
    });

    it('does not mark the pill as removable', () => {
      const {queries} = setupOneType();

      expect(queries.getByRole('button', {name: 'Images'})).not.toHaveClass('removable');
    });

    it('does not mark the pill as only active', () => {
      const {queries} = setupOneType();

      expect(queries.getByRole('button', {name: 'Images'})).not.toHaveClass('only_active');
    });

    it('does not mark the pill as addable while modifier key is held', async () => {
      const {queries} = setupOneType();
      const user = userEvent.setup();

      await user.keyboard('{Meta>}');

      expect(queries.getByRole('button', {name: 'Images'})).not.toHaveClass('addable');
    });

    it('keeps the selection when the pill is clicked', async () => {
      const {queries, fileTypeSelection} = setupOneType();
      const user = userEvent.setup();

      await user.click(queries.getByRole('button', {name: 'Images'}));

      expect(fileTypeSelection.get('collectionNames')).toEqual([]);
      expect(queries.getByRole('button', {name: 'Images'}))
        .toHaveAttribute('aria-pressed', 'true');
    });

    it('does not hint at filtering', () => {
      const {queries} = setupOneType();

      expect(queries.getByRole('group', {name: 'Filter by file type'}))
        .not.toHaveAttribute('title');
    });

    it('starts hinting at filtering once files of another type are added', () => {
      const {entry, queries} = setupOneType();

      entry.getFileCollection('video_files').add({id: 1, display_name: 'video.mp4'});

      expect(queries.getByRole('group', {name: 'Filter by file type'}))
        .toHaveAttribute('title');
      expect(queries.getByRole('button', {name: 'Images'}))
        .toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('renders pills once files of another type are added', () => {
    const {entry, fileTypes} = setup({
      filesAttributes: {image_files: [{id: 1, display_name: 'image.png'}]}
    });

    const view = new FileTypePillsView({
      entry,
      fileTypes,
      fileTypeSelection: new FileTypeSelection()
    });

    const {queryByRole} = render(view);
    entry.getFileCollection('video_files').add({id: 1, display_name: 'video.mp4'});

    expect(queryByRole('group', {name: 'Filter by file type'})).not.toBeNull();
  });

  it('renders remove and add indicators in pills', () => {
    const {entry, fileTypes} = setup();

    const view = new FileTypePillsView({
      entry,
      fileTypes,
      fileTypeSelection: new FileTypeSelection()
    });

    render(view);

    expect(view.el.querySelectorAll('.file_type_pills-remove')).toHaveLength(2);
    expect(view.el.querySelectorAll('.file_type_pills-add')).toHaveLength(2);
  });

  it('marks only selected pill as removable', () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    fileTypeSelection.selectOnly('image_files');

    expect(getByRole('button', {name: 'Images'})).toHaveClass('removable');
  });

  it('marks the only selected pill as only active', () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    fileTypeSelection.selectOnly('image_files');

    expect(getByRole('button', {name: 'Images'})).toHaveClass('only_active');
    expect(getByRole('button', {name: 'Videos'})).not.toHaveClass('only_active');
  });

  it('does not mark pills as only active while multiple types are selected', () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    fileTypeSelection.toggle('image_files');
    fileTypeSelection.toggle('video_files');

    expect(getByRole('button', {name: 'Images'})).not.toHaveClass('only_active');
    expect(getByRole('button', {name: 'Videos'})).not.toHaveClass('only_active');
  });

  it('keeps marking the only selected pill as only active while modifier key is held', async () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();
    fileTypeSelection.selectOnly('image_files');
    const user = userEvent.setup();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    await user.keyboard('{Control>}');

    expect(getByRole('button', {name: 'Images'})).toHaveClass('only_active');

    await user.keyboard('{/Control}');
  });

  it('does not mark pills as removable while multiple types are selected', () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    fileTypeSelection.toggle('image_files');
    fileTypeSelection.toggle('video_files');

    expect(getByRole('button', {name: 'Images'})).not.toHaveClass('removable');
    expect(getByRole('button', {name: 'Videos'})).not.toHaveClass('removable');
  });

  it('marks selected pills as removable while modifier key is held', async () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();
    fileTypeSelection.toggle('image_files');
    fileTypeSelection.toggle('video_files');
    const user = userEvent.setup();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    await user.keyboard('{Control>}');

    expect(getByRole('button', {name: 'Images'})).toHaveClass('removable');
    expect(getByRole('button', {name: 'Videos'})).toHaveClass('removable');

    await user.keyboard('{/Control}');

    expect(getByRole('button', {name: 'Images'})).not.toHaveClass('removable');
  });

  it('does not mark unselected pills as removable while modifier key is held', async () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();
    fileTypeSelection.selectOnly('image_files');
    const user = userEvent.setup();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    await user.keyboard('{Meta>}');

    expect(getByRole('button', {name: 'Videos'})).not.toHaveClass('removable');

    await user.keyboard('{/Meta}');
  });

  it('marks unselected pills as addable while modifier key is held', async () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();
    fileTypeSelection.selectOnly('image_files');
    const user = userEvent.setup();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    await user.keyboard('{Control>}');

    expect(getByRole('button', {name: 'Videos'})).toHaveClass('addable');
    expect(getByRole('button', {name: 'Images'})).not.toHaveClass('addable');

    await user.keyboard('{/Control}');

    expect(getByRole('button', {name: 'Videos'})).not.toHaveClass('addable');
  });

  it('does not mark pills as addable without modifier key', () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();
    fileTypeSelection.selectOnly('image_files');

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);

    expect(getByRole('button', {name: 'Videos'})).not.toHaveClass('addable');
  });

  it('stops marking pills as addable when window loses focus', async () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();
    fileTypeSelection.selectOnly('image_files');
    const user = userEvent.setup();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    await user.keyboard('{Control>}');
    window.dispatchEvent(new Event('blur'));

    expect(getByRole('button', {name: 'Videos'})).not.toHaveClass('addable');

    await user.keyboard('{/Control}');
  });

  it('stops marking pills as removable when window loses focus', async () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();
    fileTypeSelection.toggle('image_files');
    fileTypeSelection.toggle('video_files');
    const user = userEvent.setup();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    await user.keyboard('{Control>}');
    window.dispatchEvent(new Event('blur'));

    expect(getByRole('button', {name: 'Images'})).not.toHaveClass('removable');

    await user.keyboard('{/Control}');
  });

  it('stops updating pills after close', async () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();
    fileTypeSelection.toggle('image_files');
    fileTypeSelection.toggle('video_files');
    const user = userEvent.setup();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    const pill = getByRole('button', {name: 'Images'});
    view.close();
    await user.keyboard('{Control>}');

    expect(pill).not.toHaveClass('removable');

    await user.keyboard('{/Control}');
  });

  it('hints at combining file types', () => {
    const {entry, fileTypes} = setup();

    const view = new FileTypePillsView({
      entry,
      fileTypes,
      fileTypeSelection: new FileTypeSelection()
    });

    const {getByRole} = render(view);

    expect(getByRole('group', {name: 'Filter by file type'})).toHaveAttribute(
      'title',
      'Click a file type to show only its files. Hold Ctrl/Cmd to combine file types.'
    );
  });

  it('selects file type when clicking pill', async () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();
    const user = userEvent.setup();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Images'}));

    expect(fileTypeSelection.isSelected('image_files')).toBe(true);
  });

  it('deselects other file types when clicking pill', async () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();
    fileTypeSelection.toggle('video_files');
    const user = userEvent.setup();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Images'}));

    expect(fileTypeSelection.get('collectionNames')).toEqual(['image_files']);
  });

  it('deselects file type when clicking pressed pill', async () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();
    fileTypeSelection.toggle('image_files');
    const user = userEvent.setup();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Images'}));

    expect(fileTypeSelection.isSelected('image_files')).toBe(false);
  });

  it('adds file type when clicking pill with modifier key', async () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();
    fileTypeSelection.toggle('video_files');
    const user = userEvent.setup();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    await user.keyboard('{Control>}');
    await user.click(getByRole('button', {name: 'Images'}));
    await user.keyboard('{/Control}');

    expect(fileTypeSelection.get('collectionNames')).toEqual(['video_files', 'image_files']);
  });

  it('removes file type when clicking pressed pill with modifier key', async () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();
    fileTypeSelection.toggle('image_files');
    fileTypeSelection.toggle('video_files');
    const user = userEvent.setup();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    await user.keyboard('{Meta>}');
    await user.click(getByRole('button', {name: 'Images'}));
    await user.keyboard('{/Meta}');

    expect(fileTypeSelection.get('collectionNames')).toEqual(['video_files']);
  });

  it('adds file type when pressing enter on pill with modifier key', async () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();
    fileTypeSelection.toggle('video_files');
    const user = userEvent.setup();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    getByRole('button', {name: 'Images'}).focus();
    await user.keyboard('{Control>}{Enter}{/Control}');

    expect(fileTypeSelection.get('collectionNames')).toEqual(['video_files', 'image_files']);
  });

  it('removes file type when pressing space on pressed pill with modifier key', async () => {
    const {entry, fileTypes} = setup();
    const fileTypeSelection = new FileTypeSelection();
    fileTypeSelection.toggle('image_files');
    fileTypeSelection.toggle('video_files');
    const user = userEvent.setup();

    const view = new FileTypePillsView({entry, fileTypes, fileTypeSelection});

    const {getByRole} = render(view);
    getByRole('button', {name: 'Images'}).focus();
    await user.keyboard('{Meta>}[Space]{/Meta}');

    expect(fileTypeSelection.get('collectionNames')).toEqual(['video_files']);
  });

  it('displays spinner while files of file type are uploading', () => {
    const {entry, fileTypes} = setup();

    const view = new FileTypePillsView({
      entry,
      fileTypes,
      fileTypeSelection: new FileTypeSelection()
    });

    const {getByRole} = render(view);
    entry.set('uploading_video_files_count', 1);

    expect(getByRole('button', {name: 'Videos'})).toHaveClass('spinner');
    expect(getByRole('button', {name: 'Images'})).not.toHaveClass('spinner');
  });
});
