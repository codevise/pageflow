import Backbone from 'backbone';

import {FileNameInputView} from 'pageflow/ui';

describe('FileNameInputView', () => {
  it('displays extension from property value', () => {
    var model = new Backbone.Model({name: 'file.mp4'});
    var view = new FileNameInputView({
      model: model,
      propertyName: 'name'
    });

    view.render();

    expect(view.ui.input).toHaveValue('file');
    expect(view.ui.extension).toHaveText('.mp4');
  });

  it('stores edited file name including extension', () => {
    var model = new Backbone.Model({name: 'file.mp4'});
    var view = new FileNameInputView({
      model: model,
      propertyName: 'name'
    });

    view.render();

    view.ui.input.val('other');
    view.ui.input.trigger('change');

    expect(model.get('name')).toEqual('other.mp4');
  });

  it('updates extension when property changes', () => {
    var model = new Backbone.Model({name: 'file.mp4'});
    var view = new FileNameInputView({
      model: model,
      propertyName: 'name'
    });

    view.render();

    model.set('name', 'other.webm');

    expect(view.ui.input).toHaveValue('other');
    expect(view.ui.extension).toHaveText('.webm');
  });
});
