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
            model: {i18nKey: 'page'},
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
            model: {i18nKey: 'page'},
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
            model: {i18nKey: 'page'},
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
            model: {i18nKey: 'page'},
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
          model: {i18nKey: 'page'},
          propertyName: 'title'
        });

        var result = view.labelText();

        expect(result).toBe('AR Text');
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
            model: {i18nKey: 'page'},
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
              model: {i18nKey: 'page'},
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
            model: {i18nKey: 'page'},
            propertyName: 'title',
            additionalInlineHelpText: 'Extra'
          });

          var result = view.inlineHelpText();

          expect(result).toBe('Rainbow Help Extra');
        });
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
              model: {i18nKey: 'page'},
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
              model: {i18nKey: 'page'},
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
          model: {i18nKey: 'page'},
          propertyName: 'title'
        });

        var result = view.inlineHelpText();

        expect(result).toBe('Model/Attribute Help');
      });

      it('prefers disabled suffix if disabled', () => {
        var view = createInputView({
          model: {i18nKey: 'page'},
          propertyName: 'title',
          disabled: true
        });

        var result = view.inlineHelpText();

        expect(result).toBe('Model/Attribute Help Disabled');
      });
    });
  });

  describe('visibleBinding', () => {
    it('sets hidden class when attribute is false', () => {
      var view = createInputView({
        model: new Backbone.Model({active: false}),
        visibleBinding: 'active'
      });

      view.render();

      expect(view.$el).toHaveClass('input-hidden_via_binding');
    });

    it('does not set hidden class when function returns true', () => {
      var view = createInputView({
        model: new Backbone.Model({active: true}),
        visibleBinding: 'active'
      });

      view.render();

      expect(view.$el).not.toHaveClass('input-hidden_via_binding');
    });

    it('sets hidden class when attribute changes to false', () => {
      var view = createInputView({
        model: new Backbone.Model({active: true}),
        visibleBinding: 'active'
      });

      view.render();

      view.model.set('active', false);

      expect(view.$el).toHaveClass('input-hidden_via_binding');
    });

    describe('with visibleBindingValue option', () => {
      it('sets hidden class when value of attribute does not match', () => {
        var view = createInputView({
          model: new Backbone.Model({hidden: true}),
          visibleBinding: 'hidden',
          visibleBindingValue: false
        });

        view.render();

        expect(view.$el).toHaveClass('input-hidden_via_binding');
      });

      it('does not set hidden class when value of attribute matches', () => {
        var view = createInputView({
          model: new Backbone.Model({hidden: false}),
          visibleBinding: 'hidden',
          visibleBindingValue: false
        });

        view.render();

        expect(view.$el).not.toHaveClass('input-hidden_via_binding');
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

        expect(view.$el).toHaveClass('input-hidden_via_binding');
      });

      it('does not set hidden class when function returns true', () => {
        var view = createInputView({
          model: new Backbone.Model({hidden: false}),
          visibleBinding: 'hidden',
          visible: function(value) { return !value; }
        });

        view.render();

        expect(view.$el).not.toHaveClass('input-hidden_via_binding');
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

        expect(view.$el).toHaveClass('input-hidden_via_binding');
      });

      it('does not set hidden if true', () => {
        var view = createInputView({
          model: new Backbone.Model({hidden: true}),
          visibleBinding: 'hidden',
          visible: true
        });

        view.render();

        expect(view.$el).not.toHaveClass('input-hidden_via_binding');
      });
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
      template: () => ''
    });

    Cocktail.mixin(View, inputView);

    return new View(options);
  }
});
