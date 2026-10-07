import {ExplorerFileItemView, ListSelection} from 'pageflow/editor';
import Backbone from 'backbone';
import * as support from '$support';
import {renderBackboneView as render} from 'pageflow/testHelpers';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

describe('ExplorerFileItemView', () => {
  const f = support.factories;

  it('displays file title', () => {
    const file = f.file({file_name: 'original.mp4'});

    const view = new ExplorerFileItemView({
      model: file,
      selection: new Backbone.Model()
    });
    const {getByText} = render(view);

    expect(getByText('original.mp4')).not.toBeNull();
  });

  describe('with current entry', () => {
    function setup({currentEntryFiles, file}) {
      const fileTypes = f.fileTypes(function() {
        this.withImageFileType();
        this.withVideoFileType();
        this.withTextTrackFileType();
      });
      const currentEntry = f.entry({}, {fileTypes, filesAttributes: currentEntryFiles});
      const collectionName = Object.keys(file)[0];
      const model = f.file(file[collectionName], {
        fileType: fileTypes.findByCollectionName(collectionName)
      });
      const selection = new Backbone.Model();

      const view = new ExplorerFileItemView({model, selection, currentEntry});
      render(view);

      return {view, selection, model};
    }

    it('does not select file already used in current entry', () => {
      const {view, selection} = setup({
        currentEntryFiles: {image_files: [{id: 5}]},
        file: {image_files: {id: 5}}
      });

      view.el.click();

      expect(selection.get('file')).toBeUndefined();
      expect(view.el).toHaveClass('disabled');
    });

    it('selects file whose id is only used by file of other type', () => {
      const {view, selection, model} = setup({
        currentEntryFiles: {image_files: [{id: 5}]},
        file: {video_files: {id: 5}}
      });

      view.el.click();

      expect(selection.get('file')).toBe(model);
      expect(view.el).not.toHaveClass('disabled');
    });
  });

  describe('marking', () => {
    support.useFakeTranslations({
      'pageflow.editor.views.explorer_file_item_view.mark': 'Select for reuse',
      'pageflow.editor.views.explorer_file_item_view.start_marking': 'Select multiple files'
    });

    const markButtonName = /^Select (for reuse|multiple files)$/;

    function setup({selected, marked = [], currentEntryFiles} = {}) {
      const fileTypes = f.fileTypes(function() {
        this.withImageFileType();
        this.withVideoFileType();
        this.withTextTrackFileType();
      });
      const imageFileType = fileTypes.findByCollectionName('image_files');
      const file = f.file({id: 5, file_name: 'file.png'}, {fileType: imageFileType});
      const other = f.file({id: 6, file_name: 'other.png'}, {fileType: imageFileType});
      const selection = new Backbone.Model({file: selected === 'other' ? other : undefined});
      const markedFiles = new ListSelection(marked.includes('other') ? [other] : []);
      const currentEntry = currentEntryFiles &&
                           f.entry({}, {fileTypes, filesAttributes: currentEntryFiles});

      const view = new ExplorerFileItemView({model: file, selection, markedFiles, currentEntry});
      const queries = render(view);

      return {view, file, other, selection, markedFiles, ...queries};
    }

    it('does not mark file on plain click', async () => {
      const user = userEvent.setup();
      const {view, file, selection, markedFiles} = setup();

      await user.click(view.el);

      expect(selection.get('file')).toBe(file);
      expect(markedFiles.length).toBe(0);
    });

    it('marks and selects file via check button', async () => {
      const user = userEvent.setup();
      const {file, selection, markedFiles, getByRole} = setup();

      await user.click(getByRole('button', {name: markButtonName}));

      expect(markedFiles.models).toEqual([file]);
      expect(selection.get('file')).toBe(file);
    });

    it('keeps selection when unmarking file', async () => {
      const user = userEvent.setup();
      const {file, other, selection, getByRole} = setup();

      await user.click(getByRole('button', {name: markButtonName}));
      selection.set('file', other);
      await user.click(getByRole('button', {name: markButtonName}));

      expect(selection.get('file')).toBe(other);
      expect(selection.get('file')).not.toBe(file);
    });

    it('does not mark previously selected file when starting to mark', async () => {
      const user = userEvent.setup();
      const {file, markedFiles, getByRole} = setup({selected: 'other'});

      await user.click(getByRole('button', {name: markButtonName}));

      expect(markedFiles.models).toEqual([file]);
    });

    it('only selects file on plain click while other files are marked', async () => {
      const user = userEvent.setup();
      const {view, file, other, selection, markedFiles} = setup({marked: ['other']});

      await user.click(view.el);

      expect(markedFiles.models).toEqual([other]);
      expect(selection.get('file')).toBe(file);
    });

    it('does not mark file on click with modifier key', async () => {
      const user = userEvent.setup();
      const {view, markedFiles} = setup();

      await user.keyboard('{Control>}');
      await user.click(view.el);

      expect(markedFiles.length).toBe(0);
    });

    it('unmarks marked file via check button', async () => {
      const user = userEvent.setup();
      const {other, markedFiles, getByRole} = setup({marked: ['other']});

      await user.click(getByRole('button', {name: markButtonName}));
      await user.click(getByRole('button', {name: markButtonName}));

      expect(markedFiles.models).toEqual([other]);
    });

    it('indicates that files can be marked while other files are marked', () => {
      const {view} = setup({marked: ['other']});

      expect(view.el).toHaveClass('marking');
      expect(view.el).not.toHaveClass('marked');
    });

    it('does not indicate marking while no files are marked', () => {
      const {view} = setup();

      expect(view.el).not.toHaveClass('marking');
    });

    it('indicates marked state', async () => {
      const user = userEvent.setup();
      const {view, getByRole} = setup();

      await user.click(getByRole('button', {name: markButtonName}));

      expect(view.el).toHaveClass('marked');
      expect(getByRole('button', {name: markButtonName}))
        .toHaveAttribute('aria-pressed', 'true');
    });

    it('updates marked state when marks are reset', async () => {
      const user = userEvent.setup();
      const {view, markedFiles, getByRole} = setup();

      await user.click(getByRole('button', {name: markButtonName}));
      markedFiles.reset();

      expect(view.el).not.toHaveClass('marked');
    });

    it('offers selecting multiple files while no files are marked', () => {
      const {getByRole} = setup();

      expect(getByRole('button', {name: 'Select multiple files'})).not.toBeNull();
    });

    it('offers selecting file for reuse while other files are marked', () => {
      const {getByRole} = setup({marked: ['other']});

      expect(getByRole('button', {name: 'Select for reuse'})).not.toBeNull();
    });

    it('does not offer marking files already used in current entry', () => {
      const {queryByRole} = setup({currentEntryFiles: {image_files: [{id: 5}]}});

      expect(queryByRole('button', {name: markButtonName})).toBeNull();
    });
  });
});
