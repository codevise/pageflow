import {ExplorerFileItemView} from 'pageflow/editor';
import Backbone from 'backbone';
import * as support from '$support';
import {renderBackboneView as render} from 'pageflow/testHelpers';

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
});
