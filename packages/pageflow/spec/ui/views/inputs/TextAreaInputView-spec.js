import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {TextAreaInputView} from '$pageflow/ui';

import * as support from '$support';
import {TextAreaInput} from '$support/dominos/ui'

describe('pageflow.TextAreaInputView', () => {
  it('supports disabled option', () => {
    var model = new Backbone.Model({});
    var textAreaInputView = new TextAreaInputView({
      model: model,
      propertyName: 'name',
      disabled: true
    });

    textAreaInputView.render();
    var input = textAreaInputView.$el.find('textarea');

    expect(input).toHaveAttr('disabled', 'disabled');
  });

  it('supports placeholder text', () => {
    var model = new Backbone.Model({});
    var textAreaInputView = new TextAreaInputView({
      model: model,
      propertyName: 'name',
      placeholder: 'Default'
    });

    textAreaInputView.render();
    var input = textAreaInputView.$el.find('textarea');

    expect(input).toHaveAttr('placeholder', 'Default');
  });

  it('supports placeholder as function', () => {
    var model = new Backbone.Model({other: 'otherValue'});
    var textAreaInputView = new TextAreaInputView({
      model: model,
      propertyName: 'name',
      placeholder: function(m) {
        return m.get('other');
      }
    });

    textAreaInputView.render();
    var input = textAreaInputView.$el.find('textarea');

    expect(input).toHaveAttr('placeholder', 'otherValue');
  });

  it(
    'updates placeholder when placeholderBinding attribute changes',
    () => {
      var model = new Backbone.Model({other: 'old'});
      var textAreaInputView = new TextAreaInputView({
        model: model,
        propertyName: 'name',
        placeholder: function(m) {
          return m.get('other');
        },
        placeholderBinding: 'other'
      });

      textAreaInputView.render();
      var input = textAreaInputView.$el.find('textarea');
      model.set('other', 'new');

      expect(input).toHaveAttr('placeholder', 'new');
    }
  );

  it('supports reading placeholder from other model', () => {
    var placeholderModel = new Backbone.Model({name: 'otherValue'});
    var model = new Backbone.Model({});
    var textAreaInputView = new TextAreaInputView({
      model: model,
      propertyName: 'name',
      placeholderModel: placeholderModel
    });

    textAreaInputView.render();
    var input = textAreaInputView.$el.find('textarea');

    expect(input).toHaveAttr('placeholder', 'otherValue');
  });
});
