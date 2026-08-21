import {ConfirmableFileItemView} from 'pageflow/editor';
import Backbone from 'backbone';
import * as support from '$support';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('ConfirmableFileItemView', () => {
  support.useFakeTranslations({
    'pageflow.editor.templates.confirmable_file_item.remove': 'Delete',
    'pageflow.editor.views.confirmable_file_item_view.confirm_destroy': 'Really delete this file?'
  });

  it('displays file title', () => {
    const file = support.factories.file({file_name: 'original.mp4'});

    const view = new ConfirmableFileItemView({
      model: file,
      selectedFiles: new Backbone.Collection()
    });

    const {getByText} = render(view);

    expect(getByText('original.mp4')).not.toBeNull();
  });

  it('destroys file when delete is clicked', () => {
    window.confirm = jest.fn(() => true);
    const file = support.factories.file({file_name: 'original.mp4'});
    jest.spyOn(file, 'destroy').mockImplementation(() => {});

    const view = new ConfirmableFileItemView({
      model: file,
      selectedFiles: new Backbone.Collection()
    });

    const {getByTitle} = render(view);
    getByTitle('Delete').click();

    expect(window.confirm).toHaveBeenCalledWith('Really delete this file?');
    expect(file.destroy).toHaveBeenCalled();
  });

  it('keeps file when the confirmation is dismissed', () => {
    window.confirm = jest.fn(() => false);
    const file = support.factories.file({file_name: 'original.mp4'});
    jest.spyOn(file, 'destroy').mockImplementation(() => {});

    const view = new ConfirmableFileItemView({
      model: file,
      selectedFiles: new Backbone.Collection()
    });

    const {getByTitle} = render(view);
    getByTitle('Delete').click();

    expect(file.destroy).not.toHaveBeenCalled();
  });
});
