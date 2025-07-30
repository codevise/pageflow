import {ConfirmableFileItemView} from 'pageflow/editor';
import Backbone from 'backbone';
import {within} from '@testing-library/dom';
import * as support from '$support';

describe('ConfirmableFileItemView', () => {
  it('displays file title', () => {
    const file = support.factories.file({file_name: 'original.mp4'});

    const view = new ConfirmableFileItemView({
      model: file,
      selectedFiles: new Backbone.Collection()
    });

    view.render();

    const {getByText} = within(view.el);

    expect(getByText('original.mp4')).not.toBeNull();
  });
});
