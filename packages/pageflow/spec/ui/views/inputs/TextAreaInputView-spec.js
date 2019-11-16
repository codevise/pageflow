import $ from 'jquery';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {TextAreaInputView} from '$pageflow/ui';

import * as support from '$support';

describe('pageflow.TextAreaInputView', () => {
  test('supports disabled option', () => {
    var model = new Backbone.Model({});
    var textAreaInputView = new TextAreaInputView({
      model: model,
      propertyName: 'name',
      disabled: true
    });

    textAreaInputView.render();
    var input = textAreaInputView.$el.find('textarea');

    expect(input).to.have.$attr('disabled', 'disabled');
  });

  test('supports placeholder text', () => {
    var model = new Backbone.Model({});
    var textAreaInputView = new TextAreaInputView({
      model: model,
      propertyName: 'name',
      placeholder: 'Default'
    });

    textAreaInputView.render();
    var input = textAreaInputView.$el.find('textarea');

    expect(input).to.have.$attr('placeholder', 'Default');
  });

  test('supports placeholder as function', () => {
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

    expect(input).to.have.$attr('placeholder', 'otherValue');
  });

  test(
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

      expect(input).to.have.$attr('placeholder', 'new');
    }
  );

  test('supports reading placeholder from other model', () => {
    var placeholderModel = new Backbone.Model({name: 'otherValue'});
    var model = new Backbone.Model({});
    var textAreaInputView = new TextAreaInputView({
      model: model,
      propertyName: 'name',
      placeholderModel: placeholderModel
    });

    textAreaInputView.render();
    var input = textAreaInputView.$el.find('textarea');

    expect(input).to.have.$attr('placeholder', 'otherValue');
  });

  test('prefills url field with http:// when creating new link', done => {
    var model = new Backbone.Model({
      text: 'Some link'
    });
    var textAreaInputView = new TextAreaInputView({
      model: model,
      propertyName: 'text'
    });

    var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
      textAreaInputView,
      {appendTo: $('body')}
    );

    textAreaInputViewDomino.selectAll(function() {
      textAreaInputViewDomino.clickLinkButton();
      textAreaInputViewDomino.clickSaveInLinkDialog();

      expect(model.get('text')).toEqual(expect.arrayContaining(['href="http://"']));
      done();
    });
  });

  test('allows creating url link', done => {
    var model = new Backbone.Model({
      text: 'Some link'
    });
    var textAreaInputView = new TextAreaInputView({
      model: model,
      propertyName: 'text'
    });

    var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
      textAreaInputView,
      {appendTo: $('body')}
    );

    textAreaInputViewDomino.selectAll(function() {
      textAreaInputViewDomino.clickLinkButton();
      textAreaInputViewDomino.enterLinkUrl('https://example.com');
      textAreaInputViewDomino.clickSaveInLinkDialog();

      expect(model.get('text')).toEqual(expect.arrayContaining(['href="https://example.com"']));
      done();
    });
  });

  test('allows updating url link', done => {
    var model = new Backbone.Model({
      text: '<a href="https://new.example.com">Some link</a>'
    });
    var textAreaInputView = new TextAreaInputView({
      model: model,
      propertyName: 'text'
    });

    var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
      textAreaInputView,
      {appendTo: $('body')}
    );

    textAreaInputViewDomino.selectAll(function() {
      textAreaInputViewDomino.clickLinkButton();
      textAreaInputViewDomino.enterLinkUrl('https://new.example.com');
      textAreaInputViewDomino.clickSaveInLinkDialog();

      expect(model.get('text')).toEqual(expect.arrayContaining(['href="https://new.example.com"']));
      done();
    });
  });

  test('creates target blank links by default', done => {
    var model = new Backbone.Model({
      text: 'Some link'
    });
    var textAreaInputView = new TextAreaInputView({
      model: model,
      propertyName: 'text'
    });

    var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
      textAreaInputView,
      {appendTo: $('body')}
    );

    textAreaInputViewDomino.selectAll(function() {
      textAreaInputViewDomino.clickLinkButton();
      textAreaInputViewDomino.clickSaveInLinkDialog();

      expect(model.get('text')).toEqual(expect.arrayContaining(['target="_blank"']));
      done();
    });
  });

  test('allows creating target self link', done => {
    var model = new Backbone.Model({
      text: 'Some link'
    });
    var textAreaInputView = new TextAreaInputView({
      model: model,
      propertyName: 'text'
    });

    var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
      textAreaInputView,
      {appendTo: $('body')}
    );

    textAreaInputViewDomino.selectAll(function() {
      textAreaInputViewDomino.clickLinkButton();
      textAreaInputViewDomino.toggleOpenInNewTab(false);
      textAreaInputViewDomino.clickSaveInLinkDialog();

      expect(model.get('text')).toEqual(expect.arrayContaining(['target="_self"']));
      done();
    });
  });

  test('allows removing links', done => {
    var model = new Backbone.Model({
      text: 'Some <a href="http://example.com">link</a>'
    });
    var textAreaInputView = new TextAreaInputView({
      model: model,
      propertyName: 'text'
    });

    var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
      textAreaInputView,
      {appendTo: $('body')}
    );

    textAreaInputViewDomino.selectFirstLink(function() {
      textAreaInputViewDomino.clickRemoveLink();

      expect(model.get('text')).toEqual(expect.arrayContaining(['Some link']));
      done();
    });
  });

  describe('with fragmentLinkInputView option', () => {
    test('renders given view', () => {
      var model = new Backbone.Model({});
      var FragmentLinkInputView = Backbone.View.extend({
        className: 'some_fragment_link_input_view'
      });
      var textAreaInputView = new TextAreaInputView({
        model: model,
        propertyName: 'text',
        fragmentLinkInputView: FragmentLinkInputView
      });

      textAreaInputView.render();

      expect(textAreaInputView.$el.find('.some_fragment_link_input_view').length).toBe(1);
    });

    test(
      'passes property value to fragment link view when selecting link',
      done => {
        var model = new Backbone.Model({
          text: 'Some <a href="#123">link</a>'
        });
        var propertyValue;
        var FragmentLinkInputView = Marionette.View.extend({
          modelEvents: {
            'change': function() {
              propertyValue = this.model.get(this.options.propertyName);
            }
          }
        });
        var textAreaInputView = new TextAreaInputView({
          model: model,
          propertyName: 'text',
          fragmentLinkInputView: FragmentLinkInputView
        });

        var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
          textAreaInputView,
          {appendTo: $('body')}
        );

        textAreaInputViewDomino.selectFirstLink(function() {
          expect(propertyValue).toBe('123');
          done();
        });
      }
    );

    test('updates link when view sets property value', done => {
      var model = new Backbone.Model({
        text: 'Some <a href="#123">link</a>'
      });
      var updateFragmentLink;
      var FragmentLinkInputView = Marionette.View.extend({
        initialize: function() {
          updateFragmentLink = _.bind(function(value) {
            this.model.set(this.options.propertyName, value);
          }, this);
        }
      });
      var textAreaInputView = new TextAreaInputView({
        model: model,
        propertyName: 'text',
        fragmentLinkInputView: FragmentLinkInputView
      });

      var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
        textAreaInputView,
        {appendTo: $('body')}
      );

      textAreaInputViewDomino.selectFirstLink(function() {
        updateFragmentLink(456);
        textAreaInputViewDomino.clickSaveInLinkDialog();

        expect(model.get('text')).toEqual(expect.arrayContaining(['href="#456"']));
        done();
      });
    });

    test(
      'resets url field to http:// when switching from fragment link to url link',
      done => {
        var model = new Backbone.Model({
          text: 'Some <a href="#123">link</a>'
        });
        var FragmentLinkInputView = Marionette.View.extend({});
        var textAreaInputView = new TextAreaInputView({
          model: model,
          propertyName: 'text',
          fragmentLinkInputView: FragmentLinkInputView
        });

        var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
          textAreaInputView,
          {appendTo: $('body')}
        );

        textAreaInputViewDomino.selectFirstLink(function() {
          textAreaInputViewDomino.clickUrlLinkRadioButton();
          textAreaInputViewDomino.clickSaveInLinkDialog();

          expect(model.get('text')).toEqual(expect.arrayContaining(['href="http://"']));
          done();
        });
      }
    );

    test(
      'resets target to blank when switching from fragment link to url link',
      done => {
        var model = new Backbone.Model({
          text: 'Some <a href="#123" target="_self">link</a>'
        });
        var FragmentLinkInputView = Marionette.View.extend({});
        var textAreaInputView = new TextAreaInputView({
          model: model,
          propertyName: 'text',
          fragmentLinkInputView: FragmentLinkInputView
        });

        var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
          textAreaInputView,
          {appendTo: $('body')}
        );

        textAreaInputViewDomino.selectFirstLink(function() {
          textAreaInputViewDomino.clickUrlLinkRadioButton();
          textAreaInputViewDomino.clickSaveInLinkDialog();

          expect(model.get('text')).toEqual(expect.arrayContaining(['target="_blank"']));
          done();
        });
      }
    );

    test(
      'does not change fragment link when toggling link type back and forth',
      done => {
        var model = new Backbone.Model({
          text: 'Some <a href="#123">link</a>'
        });
        var FragmentLinkInputView = Marionette.View.extend({});
        var textAreaInputView = new TextAreaInputView({
          model: model,
          propertyName: 'text',
          fragmentLinkInputView: FragmentLinkInputView
        });

        var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
          textAreaInputView,
          {appendTo: $('body')}
        );

        textAreaInputViewDomino.selectFirstLink(function() {
          textAreaInputViewDomino.clickUrlLinkRadioButton();
          textAreaInputViewDomino.enterLinkUrl('https://example.com');
          textAreaInputViewDomino.clickFragmentLinkRadioButton();
          textAreaInputViewDomino.clickSaveInLinkDialog();

          expect(model.get('text')).toEqual(expect.arrayContaining(['href="#123"']));
          done();
        });
      }
    );

    test(
      'resets url to # when switching from url link to fragment link',
      done => {
        var model = new Backbone.Model({
          text: 'Some <a href="https://example.com">link</a>'
        });
        var FragmentLinkInputView = Marionette.View.extend({});
        var textAreaInputView = new TextAreaInputView({
          model: model,
          propertyName: 'text',
          fragmentLinkInputView: FragmentLinkInputView
        });

        var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
          textAreaInputView,
          {appendTo: $('body')}
        );

        textAreaInputViewDomino.selectFirstLink(function() {
          textAreaInputViewDomino.clickFragmentLinkRadioButton();
          textAreaInputViewDomino.clickSaveInLinkDialog();

          expect(model.get('text')).toEqual(expect.arrayContaining(['href="#"']));
          done();
        });
      }
    );

    test(
      'does not change url link when toggling link type back and forth',
      done => {
        var model = new Backbone.Model({
          text: 'Some <a href="http://example.com">link</a>'
        });
        var updateFragmentLink;
        var FragmentLinkInputView = Marionette.View.extend({
          initialize: function() {
            updateFragmentLink = _.bind(function(value) {
              this.model.set(this.options.propertyName, value);
            }, this);
          }
        });
        var textAreaInputView = new TextAreaInputView({
          model: model,
          propertyName: 'text',
          fragmentLinkInputView: FragmentLinkInputView
        });

        var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
          textAreaInputView,
          {appendTo: $('body')}
        );

        textAreaInputViewDomino.selectFirstLink(function() {
          textAreaInputViewDomino.clickFragmentLinkRadioButton();
          updateFragmentLink(123);
          textAreaInputViewDomino.clickUrlLinkRadioButton();
          textAreaInputViewDomino.clickSaveInLinkDialog();

          expect(model.get('text')).toEqual(expect.arrayContaining(['href="http://example.com"']));
          done();
        });
      }
    );

    test(
      'does not change url link target when toggling link type back and forth',
      done => {
        var model = new Backbone.Model({
          text: 'Some <a href="http://example.com" target="_self">link</a>'
        });
        var updateFragmentLink;
        var FragmentLinkInputView = Marionette.View.extend({
          initialize: function() {
            updateFragmentLink = _.bind(function(value) {
              this.model.set(this.options.propertyName, value);
            }, this);
          }
        });
        var textAreaInputView = new TextAreaInputView({
          model: model,
          propertyName: 'text',
          fragmentLinkInputView: FragmentLinkInputView
        });

        var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
          textAreaInputView,
          {appendTo: $('body')}
        );

        textAreaInputViewDomino.selectFirstLink(function() {
          textAreaInputViewDomino.clickFragmentLinkRadioButton();
          updateFragmentLink(123);
          textAreaInputViewDomino.clickUrlLinkRadioButton();
          textAreaInputViewDomino.clickSaveInLinkDialog();

          expect(model.get('text')).toEqual(expect.arrayContaining(['target="_self"']));
          done();
        });
      }
    );

    test('allows creating url link', done => {
      var model = new Backbone.Model({
        text: 'Some link'
      });
      var FragmentLinkInputView = Marionette.View.extend({});
      var textAreaInputView = new TextAreaInputView({
        model: model,
        propertyName: 'text',
        fragmentLinkInputView: FragmentLinkInputView
      });

      var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
        textAreaInputView,
        {appendTo: $('body')}
      );

      textAreaInputViewDomino.selectAll(function() {
        textAreaInputViewDomino.clickLinkButton();
        textAreaInputViewDomino.enterLinkUrl('https://example.com');
        textAreaInputViewDomino.clickSaveInLinkDialog();

        expect(model.get('text')).toEqual(expect.arrayContaining(['href="https://example.com"']));
        done();
      });
    });

    test('allows creating fragment link', done => {
      var model = new Backbone.Model({
        text: 'Some link'
      });
      var updateFragmentLink;
      var FragmentLinkInputView = Marionette.View.extend({
        initialize: function() {
          updateFragmentLink = _.bind(function(value) {
            this.model.set(this.options.propertyName, value);
          }, this);
        }
      });
      var textAreaInputView = new TextAreaInputView({
        model: model,
        propertyName: 'text',
        fragmentLinkInputView: FragmentLinkInputView
      });

      var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
        textAreaInputView,
        {appendTo: $('body')}
      );

      textAreaInputViewDomino.selectAll(function() {
        textAreaInputViewDomino.clickLinkButton();
        textAreaInputViewDomino.clickFragmentLinkRadioButton();
        updateFragmentLink(123);
        textAreaInputViewDomino.clickSaveInLinkDialog();

        expect(model.get('text')).toEqual(expect.arrayContaining(['href="#123"']));
        done();
      });
    });

    test('creates fragment link with target self', done => {
      var model = new Backbone.Model({
        text: 'Some link'
      });
      var FragmentLinkInputView = Marionette.View.extend({});
      var textAreaInputView = new TextAreaInputView({
        model: model,
        propertyName: 'text',
        fragmentLinkInputView: FragmentLinkInputView
      });

      var textAreaInputViewDomino = support.dom.TextAreaInputView.render(
        textAreaInputView,
        {appendTo: $('body')}
      );

      textAreaInputViewDomino.selectAll(function() {
        textAreaInputViewDomino.clickLinkButton();
        textAreaInputViewDomino.clickFragmentLinkRadioButton();
        textAreaInputViewDomino.clickSaveInLinkDialog();

        expect(model.get('text')).toEqual(expect.arrayContaining(['target="_self"']));
        done();
      });
    });
  });
});
