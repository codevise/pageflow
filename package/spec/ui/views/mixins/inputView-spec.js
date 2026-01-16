import Backbone from 'backbone';
import Cocktail from 'cocktail';
import Marionette from 'backbone.marionette';

import {inputView} from 'pageflow/ui';

import * as support from '$support';

describe('pageflow.inputView', () => {
  describe('attributeTranslationKeys', () => {
    describe('without attributeTranslationKeyPrefixes', () => {
      it(
        'constructs fallback key from fallback prefix, model i18nKey and propertyName',
        () => {
          var view = createInputView({
            model: createModel({}, {i18nKey: 'page'}),
            propertyName: 'title'
          });

          var result = view.attributeTranslationKeys('label', {fallbackPrefix: 'activerecord.attributes'});

          expect(result).toEqual(['activerecord.attributes.page.title']);
        }
      );
    });

    describe('with attributeTranslationKeyPrefixes', () => {
      it(
        'constructs additional candidates from prefix, propertyName and given key',
        () => {
          var view = createInputView({
            attributeTranslationKeyPrefixes: [
              'pageflow.rainbows.page_attributes',
              'pageflow.common_page_attributes'
            ],
            model: createModel({}, {i18nKey: 'page'}),
            propertyName: 'title'
          });

          var result = view.attributeTranslationKeys('label', {fallbackPrefix: 'activerecord.attributes'});

          expect(result).toEqual([
            'pageflow.rainbows.page_attributes.title.label',
            'pageflow.common_page_attributes.title.label',
            'activerecord.attributes.page.title'
          ]);
        }
      );
    });

    describe('with attributeTranslationPropertyName', () => {
      it(
        'uses attributeTranslationPropertyName instead of propertyName for translation keys',
        () => {
          var view = createInputView({
            attributeTranslationKeyPrefixes: [
              'pageflow.rainbows.page_attributes'
            ],
            model: createModel({}, {i18nKey: 'page'}),
            propertyName: 'prefixed_title',
            attributeTranslationPropertyName: 'title'
          });

          var result = view.attributeTranslationKeys('label', {fallbackPrefix: 'activerecord.attributes'});

          expect(result).toEqual([
            'pageflow.rainbows.page_attributes.title.label',
            'activerecord.attributes.page.title'
          ]);
        }
      );
    });
  });

  describe('#labelText', () => {
    describe('with label option', () => {
      it('returns label option', () => {
        var view = createInputView({label: 'Some Label'});

        var result = view.labelText();

        expect(result).toBe('Some Label');
      });
    });

    describe('with attributeTranslationKeyPrefixes option', () => {
      describe('with present prefixed attribute translation', () => {
        support.useFakeTranslations({
          'pageflow.rainbows.page_attributes.title.label': 'Rainbow Text',
          'activerecord.attributes.page.title': 'AR Text'
        });

        it('uses prefixed attribute translation', () => {
          var view = createInputView({
            attributeTranslationKeyPrefixes: [
              'pageflow.rainbows.page_attributes'
            ],
            model: createModel({}, {i18nKey: 'page'}),
            propertyName: 'title'
          });

          var result = view.labelText();

          expect(result).toBe('Rainbow Text');
        });
      });

      describe('with missing prefixed attribute translation', () => {
        support.useFakeTranslations({
          'activerecord.attributes.page.title': 'AR Text'
        });

        it('falls back to active record attribute translation', () => {
          var view = createInputView({
            attributeTranslationKeyPrefixes: [
              'pageflow.rainbows.page_attributes'
            ],
            model: createModel({}, {i18nKey: 'page'}),
            propertyName: 'title'
          });

          var result = view.labelText();

          expect(result).toBe('AR Text');
        });
      });
    });

    describe('without attributeTranslationKeyPrefixes', () => {
      support.useFakeTranslations({
        'activerecord.attributes.page.title': 'AR Text'
      });

      it('uses active record attribute translation', () => {
        var view = createInputView({
          model: createModel({}, {i18nKey: 'page'}),
          propertyName: 'title'
        });

        var result = view.labelText();

        expect(result).toBe('AR Text');
      });
    });

    describe('with attributeTranslationPropertyName', () => {
      support.useFakeTranslations({
        'pageflow.rainbows.page_attributes.title.label': 'Rainbow Text'
      });

      it('uses attributeTranslationPropertyName for prefixed translation lookup', () => {
        var view = createInputView({
          attributeTranslationKeyPrefixes: [
            'pageflow.rainbows.page_attributes'
          ],
          model: createModel({}, {i18nKey: 'page'}),
          propertyName: 'prefixed_title',
          attributeTranslationPropertyName: 'title'
        });

        var result = view.labelText();

        expect(result).toBe('Rainbow Text');
      });
    });
  });

  describe('#inlineHelpText', () => {
    describe('with attributeTranslationKeyPrefixes option', () => {
      describe('with present prefixed attribute translation', () => {
        support.useFakeTranslations({
          'pageflow.rainbows.page_attributes.title.inline_help': 'Rainbow Help',
          'pageflow.rainbows.page_attributes.title.inline_help_disabled': 'Rainbow Help Disabled',
          'pageflow.ui.inline_help.page.title': 'Model/Attribute Help'
        });

        it('uses prefixed inline help translation', () => {
          var view = createInputView({
            attributeTranslationKeyPrefixes: [
              'pageflow.rainbows.page_attributes'
            ],
            model: createModel({}, {i18nKey: 'page'}),
            propertyName: 'title'
          });

          var result = view.inlineHelpText();

          expect(result).toBe('Rainbow Help');
        });

        it(
          'prefers prefixed inline help translation for disabled input',
          () => {
            var view = createInputView({
              attributeTranslationKeyPrefixes: [
                'pageflow.rainbows.page_attributes'
              ],
              model: createModel({}, {i18nKey: 'page'}),
              propertyName: 'title',
              disabled: true
            });

            var result = view.inlineHelpText();

            expect(result).toBe('Rainbow Help Disabled');
          }
        );

        it('supports appending additional inline help text', () => {
          var view = createInputView({
            attributeTranslationKeyPrefixes: [
              'pageflow.rainbows.page_attributes'
            ],
            model: createModel({}, {i18nKey: 'page'}),
            propertyName: 'title',
            additionalInlineHelpText: 'Extra'
          });

          var result = view.inlineHelpText();

          expect(result).toBe('Rainbow Help Extra');
        });

        it(
          'is updated in DOM when attribute bound to disabled option changes',
          () => {
            var model = new Backbone.Model({enabled: true});
            model.i18nKey = 'page';
            var view = createInputView({
              attributeTranslationKeyPrefixes: [
                'pageflow.rainbows.page_attributes'
              ],
              model,
              propertyName: 'title',
              disabledBinding: 'enabled',
              disabled: enabled => !enabled
            });

            view.render();

            expect(view.ui.inlineHelp.text()).toBe('Rainbow Help');
            view.model.set('enabled', false);
            expect(view.ui.inlineHelp.text()).toBe('Rainbow Help Disabled');
          }
        );
      });

      describe('with multiple prefixed attribute translations', () => {
        support.useFakeTranslations({
          'pageflow.rainbows.page_attributes.title.inline_help': 'Rainbow Help',
          'pageflow.common_page_attributes.title.inline_help': 'Common Help',
          'pageflow.common_page_attributes.title.inline_help_disabled': 'Common Help Disabled',
          'pageflow.ui.inline_help.page.title': 'Model/Attribute Help'
        });

        it(
          'prefers more specific inline help over disabled inline help',
          () => {
            var view = createInputView({
              attributeTranslationKeyPrefixes: [
                'pageflow.rainbows.page_attributes',
                'pageflow.common_page_attributes'
              ],
              model: createModel({}, {i18nKey: 'page'}),
              propertyName: 'title',
              disabled: true
            });

            var result = view.inlineHelpText();

            expect(result).toBe('Rainbow Help');
          }
        );
      });

      describe('with missing prefixed attribute translation', () => {
        support.useFakeTranslations({
          'pageflow.ui.inline_help.page.title_html': '<strong>Model/Attribute Help</strong>'
        });

        it(
          'falls back to model/attribute based inline help translation',
          () => {
            var view = createInputView({
              attributeTranslationKeyPrefixes: [
                'pageflow.rainbows.page_attributes'
              ],
              model: createModel({}, {i18nKey: 'page'}),
              propertyName: 'title'
            });

            var result = view.inlineHelpText();

            expect(result).toBe('<strong>Model/Attribute Help</strong>');
          }
        );
      });
    });

    describe('without attributeTranslationKeyPrefixes', () => {
      support.useFakeTranslations({
        'pageflow.ui.inline_help.page.title': 'Model/Attribute Help',
        'pageflow.ui.inline_help.page.title_disabled': 'Model/Attribute Help Disabled'
      });

      it('uses model/attribute based inline help translation', () => {
        var view = createInputView({
          model: createModel({}, {i18nKey: 'page'}),
          propertyName: 'title'
        });

        var result = view.inlineHelpText();

        expect(result).toBe('Model/Attribute Help');
      });

      it('prefers disabled suffix if disabled', () => {
        var view = createInputView({
          model: createModel({}, {i18nKey: 'page'}),
          propertyName: 'title',
          disabled: true
        });

        var result = view.inlineHelpText();

        expect(result).toBe('Model/Attribute Help Disabled');
      });
    });
  });

  describe('disabledBinding', () => {
    it('does not disable input by default', () => {
      var view = createInputViewWithInput({
        model: new Backbone.Model()
      });

      view.render();

      expect(view.ui.input).not.toHaveAttr('disabled');
    });

    it('disables input when attribute is true', () => {
      var view = createInputViewWithInput({
        model: new Backbone.Model({disable: true}),
        disabledBinding: 'disable'
      });

      view.render();

      expect(view.ui.input).toHaveAttr('disabled');
    });

    it('sets CSS class iff disabled', () => {
      var view = createInputViewWithInput({
        model: new Backbone.Model(),
        disabledBinding: 'disable'
      });

      view.render();

      expect(view.$el).not.toHaveClass('input-disabled');

      view.model.set('disable', true);
      expect(view.$el).toHaveClass('input-disabled');
    });

    it('does not disable input when attribute is false', () => {
      var view = createInputViewWithInput({
        model: new Backbone.Model({disable: false}),
        disabledBinding: 'disable'
      });

      view.render();

      expect(view.ui.input).not.toHaveAttr('disabled');
    });

    it('disabled input when attribute changes to true', () => {
      var view = createInputViewWithInput({
        model: new Backbone.Model({disable: false}),
        disabledBinding: 'disable'
      });

      view.render();

      view.model.set('disable', true);

      expect(view.ui.input).toHaveAttr('disabled');
    });

    it('allows overriding updateDisabled method for custom behavior', () => {
      var view = createInputViewWithInput({
        model: new Backbone.Model({disable: false}),
        disabledBinding: 'disable'
      });
      view.updateDisabled = jest.fn();

      view.render();
      expect(view.updateDisabled).toHaveBeenCalledWith(false);

      view.model.set('disable', true);
      expect(view.updateDisabled).toHaveBeenCalledWith(true);
    });

    it('always passes boolean to updateDisabled even is attribute is not set ', () => {
      var view = createInputViewWithInput({
        model: new Backbone.Model(),
        disabledBinding: 'disable'
      });
      view.updateDisabled = jest.fn();

      view.render();

      expect(view.updateDisabled).toHaveBeenCalledWith(false);
    });

    describe('with disabledBindingValue option', () => {
      it('disables input when value of attribute match', () => {
        var view = createInputViewWithInput({
          model: new Backbone.Model({disable: true}),
          disabledBinding: 'disable',
          disabledBindingValue: true
        });

        view.render();

        expect(view.ui.input).toHaveAttr('disabled');
      });

      it('does not disable input when value of attribute do not match', () => {
        var view = createInputViewWithInput({
          model: new Backbone.Model({disable: false}),
          disabledBinding: 'disable',
          disabledBindingValue: true
        });

        view.render();

        expect(view.ui.input).not.toHaveAttr('disabled');
      });
    });

    describe('with disabledBindingModel option', () => {
      it('adds listener to passed model instead', () => {
        const otherModel = new Backbone.Model();
        var view = createInputViewWithInput({
          model: new Backbone.Model(),
          disabledBinding: 'disable',
          disabledBindingModel: otherModel,
          disabledBindingValue: true
        });

        view.render();
        otherModel.set({disable: true});

        expect(view.ui.input).toHaveAttr('disabled');
      });
    });

    describe('with function for disabled option', () => {
      it('disables input when function returns true', () => {
        var view = createInputViewWithInput({
          model: new Backbone.Model({enabled: false}),
          disabledBinding: 'enabled',
          disabled: function(value) { return !value; }
        });

        view.render();

        expect(view.ui.input).toHaveAttr('disabled');
      });

      it('does not disable input when function returns false', () => {
        var view = createInputViewWithInput({
          model: new Backbone.Model({enabled: true}),
          disabledBinding: 'enabled',
          disabled: function(value) { return !value; }
        });

        view.render();

        expect(view.ui.input).not.toHaveAttr('disabled');
      });

      it('does not disable input when function returns undefined', () => {
        var view = createInputViewWithInput({
          model: new Backbone.Model({enabled: true}),
          disabledBinding: 'enabled',
          disabled: function() { return undefined; }
        });

        view.render();

        expect(view.ui.input).not.toHaveAttr('disabled');
      });

      describe('with disabledBindingModel', () => {
        it('passes value from binding model to function', () => {
          var otherModel = new Backbone.Model({state: 'disabled'})
          var view = createInputViewWithInput({
            model: new Backbone.Model({}),
            disabledBindingModel: otherModel,
            disabledBinding: 'state',
            disabled: function(value) { return value === 'disabled'; }
          });

          view.render();

          expect(view.ui.input).toHaveAttr('disabled');
        });
      });
      describe('with multiple binding attributes', () => {
        it('passes array of values to function', () => {
          const disabledFunction = jest.fn();
          var view = createInputViewWithInput({
            model: new Backbone.Model({disable: false, active: true}),
            disabledBinding: ['disable', 'active'],
            disabled: disabledFunction
          });

          view.render();

          expect(disabledFunction).toHaveBeenCalledWith([false, true]);
        });

        it('disables input when return valie of function changes to true', () => {
          var view = createInputViewWithInput({
            model: new Backbone.Model({disable: false, active: true}),
            disabledBinding: ['disable', 'active'],
            disabled: ([disable, active]) => !active || disable
          });

          view.render();
          view.model.set('active', false);

          expect(view.ui.input).toHaveAttr('disabled');
        });
      });
    });

    describe('with boolean for disabled option', () => {
      it('disables input if true', () => {
        var view = createInputViewWithInput({
          model: new Backbone.Model(),
          disabled: true
        });

        view.render();

        expect(view.ui.input).toHaveAttr('disabled');
      });

      it('does not disable input if false', () => {
        var view = createInputViewWithInput({
          model: new Backbone.Model(),
          disabled: false
        });

        view.render();

        expect(view.ui.input).not.toHaveAttr('disabled');
      });
    });

    function createInputViewWithInput(options) {
      var View = Marionette.ItemView.extend({
        template: () => '<input />',

        ui: {
          input: 'input'
        }
      });

      Cocktail.mixin(View, inputView);

      return new View(options);
    }
  });

  describe('visibleBinding', () => {
    it('does not set hidden class by default', () => {
      var view = createInputView({
        model: new Backbone.Model()
      });

      view.render();

      expect(view.$el).not.toHaveClass('hidden_via_binding');
    });

    it('sets hidden class when attribute is false', () => {
      var view = createInputView({
        model: new Backbone.Model({active: false}),
        visibleBinding: 'active'
      });

      view.render();

      expect(view.$el).toHaveClass('hidden_via_binding');
    });

    it('does not set hidden class when attribute is true', () => {
      var view = createInputView({
        model: new Backbone.Model({active: true}),
        visibleBinding: 'active'
      });

      view.render();

      expect(view.$el).not.toHaveClass('hidden_via_binding');
    });

    it('sets hidden class when attribute changes to false', () => {
      var view = createInputView({
        model: new Backbone.Model({active: true}),
        visibleBinding: 'active'
      });

      view.render();

      view.model.set('active', false);

      expect(view.$el).toHaveClass('hidden_via_binding');
    });

    it('allows overriding updateVisible method for custom behavior', () => {
      var view = createInputView({
        model: new Backbone.Model({visible: false}),
        visibleBinding: 'visible'
      });
      view.updateVisible = jest.fn();

      view.render();
      expect(view.updateVisible).toHaveBeenCalledWith(false);

      view.model.set('visible', true);
      expect(view.updateVisible).toHaveBeenCalledWith(true);
    });

    it('always passes boolean to updateVisible even is attribute is not set ', () => {
      var view = createInputView({
        model: new Backbone.Model(),
        visibleBinding: 'visible'
      });
      view.updateVisible = jest.fn();

      view.render();

      expect(view.updateVisible).toHaveBeenCalledWith(false);
    });

    describe('with visibleBindingValue option', () => {
      it('sets hidden class when value of attribute does not match', () => {
        var view = createInputView({
          model: new Backbone.Model({hidden: true}),
          visibleBinding: 'hidden',
          visibleBindingValue: false
        });

        view.render();

        expect(view.$el).toHaveClass('hidden_via_binding');
      });

      it('does not set hidden class when value of attribute matches', () => {
        var view = createInputView({
          model: new Backbone.Model({hidden: false}),
          visibleBinding: 'hidden',
          visibleBindingValue: false
        });

        view.render();

        expect(view.$el).not.toHaveClass('hidden_via_binding');
      });
    });

    describe('with function for visible option', () => {
      it('sets hidden class when function returns false', () => {
        var view = createInputView({
          model: new Backbone.Model({hidden: true}),
          visibleBinding: 'hidden',
          visible: function(value) { return !value; }
        });

        view.render();

        expect(view.$el).toHaveClass('hidden_via_binding');
      });

      it('does not set hidden class when function returns true', () => {
        var view = createInputView({
          model: new Backbone.Model({hidden: false}),
          visibleBinding: 'hidden',
          visible: function(value) { return !value; }
        });

        view.render();

        expect(view.$el).not.toHaveClass('hidden_via_binding');
      });

      describe('with multiple binding attributes', () => {
        it('passes array of values to function', () => {
          const visibleFunction = jest.fn();
          var view = createInputView({
            model: new Backbone.Model({hidden: false, active: true}),
            visibleBinding: ['hidden', 'active'],
            visible: visibleFunction
          });

          view.render();

          expect(visibleFunction).toHaveBeenCalledWith([false, true]);
        });

        it('sets hidden class when attribute changes to false', () => {
          var view = createInputView({
            model: new Backbone.Model({hidden: false, active: true}),
            visibleBinding: ['hidden', 'active'],
            visible: ([hidden, active]) => active && !hidden
          });

          view.render();
          view.model.set('active', false);

          expect(view.$el).toHaveClass('hidden_via_binding');
        });
      });
    });

    describe('with boolean for visible option', () => {
      it('sets hidden class if false', () => {
        var view = createInputView({
          model: new Backbone.Model({hidden: true}),
          visibleBinding: 'hidden',
          visible: false
        });

        view.render();

        expect(view.$el).toHaveClass('hidden_via_binding');
      });

      it('does not set hidden if true', () => {
        var view = createInputView({
          model: new Backbone.Model({hidden: true}),
          visibleBinding: 'hidden',
          visible: true
        });

        view.render();

        expect(view.$el).not.toHaveClass('hidden_via_binding');
      });
    });
  });

  describe('hideLabel', () => {
    it('adds visually_hidden class to label when true', () => {
      var view = createInputView({
        model: new Backbone.Model(),
        hideLabel: true
      });

      view.render();

      expect(view.ui.label).toHaveClass('visually_hidden');
    });

    it('does not add visually_hidden class to label by default', () => {
      var view = createInputView({
        model: new Backbone.Model()
      });

      view.render();

      expect(view.ui.label).not.toHaveClass('visually_hidden');
    });
  });

  describe('for view with input and label', () => {
    it('generates for and id attributes', () => {
      const Model = Backbone.Model.extend({
        modelName: 'item'
      });
      const view = createInputViewWithInput({
        template: `<label></label>
                   <input />`,
        options: {
          model: new Model(),
          propertyName: 'text'
        }
      });

      view.render();

      expect(view.ui.input).toHaveAttr('id', 'input_item_text');
      expect(view.ui.label).toHaveAttr('for', 'input_item_text');
    });

    it('does not override existing id', () => {
      const Model = Backbone.Model.extend({
        modelName: 'item'
      });
      const view = createInputViewWithInput({
        template: `<label></label>
                   <input id="foo" />`,
        options: {
          model: new Model(),
          propertyName: 'text'
        }
      });

      view.render();

      expect(view.ui.input).toHaveAttr('id', 'foo');
    });

    it('does set id if label is not present', () => {
      const Model = Backbone.Model.extend({
        modelName: 'item'
      });
      const view = createInputViewWithInput({
        template: `<input />`,
        options: {
          model: new Model(),
          propertyName: 'text'
        }
      });

      view.render();

      expect(view.ui.input).not.toHaveAttr('id');
    });

    it('lets view override label ui reference', () => {
      const Model = Backbone.Model.extend({
        modelName: 'item'
      });
      const view = createInputViewWithInput({
        template: `<div></div>
                   <input />`,
        ui: {
          label: 'div'
        },
        options: {
          model: new Model(),
          propertyName: 'text'
        }
      });

      view.render();

      expect(view.$el.find('div')).toHaveAttr('for');
    });

    function createInputViewWithInput({template, ui, options}) {
      var View = Marionette.ItemView.extend({
        template: () => template,

        ui: {
          input: 'input',
          ...ui
        }
      });

      Cocktail.mixin(View, inputView);

      return new View(options);
    }
  });

  function createInputView(options) {
    var View = Marionette.ItemView.extend({
      template: () => '<label><div class="name"></div><div class="inline_help"></div></label>'
    });

    Cocktail.mixin(View, inputView);

    return new View(options);
  }

  function createModel(attributes, {i18nKey}) {
    const model = new Backbone.Model(attributes);
    model.i18nKey = i18nKey;
    return model;
  }
});
