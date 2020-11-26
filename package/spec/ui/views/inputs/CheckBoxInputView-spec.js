import Backbone from 'backbone';

import {CheckBoxInputView} from 'pageflow/ui';

describe('pageflow.CheckBoxInputView', () => {
  var Model = Backbone.Model.extend();

  it('loads value', () => {
    var model = new Model({value: true});
    var view = new CheckBoxInputView({
      model: model,
      propertyName: 'value'
    });

    view.render();

    expect(view.ui.input.is(':checked')).toEqual(true);
  });

  it('supports displaying unchecked if disabled', () => {
    var model = new Model({value: true});
    var view = new CheckBoxInputView({
      model: model,
      propertyName: 'value',
      disabled: true,
      displayUncheckedIfDisabled: true
    });

    view.render();

    expect(view.ui.input.is(':checked')).toEqual(false);
  });

  it('supports attribute binding for disabled option', () => {
    var model = new Model({value: true, disabled: false});
    var view = new CheckBoxInputView({
      model: model,
      propertyName: 'value',
      disabledBinding: 'disabled',
      displayUncheckedIfDisabled: true
    });

    view.render();

    expect(view.ui.input.is(':checked')).toEqual(true);
    model.set('disabled', true);
    expect(view.ui.input.is(':checked')).toEqual(false);
    model.set('disabled', false);
    expect(view.ui.input.is(':checked')).toEqual(true);
  });
});
