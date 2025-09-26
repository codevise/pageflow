import {ConfirmableFileItemView} from 'pageflow/editor';
import Backbone from 'backbone';
import * as support from '$support';
import {renderBackboneView as render} from 'pageflow/testHelpers';

describe('ConfirmableFileItemView', () => {
  it('displays file title', () => {
    const file = support.factories.file({file_name: 'original.mp4'});

    const view = new ConfirmableFileItemView({
      model: file,
      selectedFiles: new Backbone.Collection()
    });

    const {getByText} = render(view);

    expect(getByText('original.mp4')).not.toBeNull();
  });
});
