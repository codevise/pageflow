describe('pageflow.inputView', function() {
  describe('attributeTranslationKeys', function() {
    describe('without attributeTranslationKeyPrefixes', function() {
      it('constructs fallback key from fallback prefix, model i18nKey and propertyName', function() {
        var view = createInputView({
          model: {i18nKey: 'page'},
          propertyName: 'title'
        });

        var result = view.attributeTranslationKeys('label', {fallbackPrefix: 'activerecord.attributes'});

        expect(result).to.deep.eq(['activerecord.attributes.page.title']);
      });
    });

    describe('with attributeTranslationKeyPrefixes', function() {
      it('constructs additional candidates from prefix, propertyName and given key', function() {
        var view = createInputView({
          attributeTranslationKeyPrefixes: [
            'pageflow.rainbows.page_attributes',
            'pageflow.common_page_attributes'
          ],
          model: {i18nKey: 'page'},
          propertyName: 'title'
        });

        var result = view.attributeTranslationKeys('label', {fallbackPrefix: 'activerecord.attributes'});

        expect(result).to.deep.eq([
          'pageflow.rainbows.page_attributes.title.label',
          'pageflow.common_page_attributes.title.label',
          'activerecord.attributes.page.title'
        ]);
      });
    });
  });

  describe('#labelText', function() {
    describe('with label option', function() {
      it('returns label option', function() {
        var view = createInputView({label: 'Some Label'});

        var result = view.labelText();

        expect(result).to.eq('Some Label');
      });
    });

    describe('with attributeTranslationKeyPrefixes option', function() {
      describe('with present prefixed attribute translation', function() {
        support.useFakeTranslations({
          'pageflow.rainbows.page_attributes.title.label': 'Rainbow Text',
          'activerecord.attributes.page.title': 'AR Text'
        });

        it('uses prefixed attribute translation', function() {
          var view = createInputView({
            attributeTranslationKeyPrefixes: [
              'pageflow.rainbows.page_attributes'
            ],
            model: {i18nKey: 'page'},
            propertyName: 'title'
          });

          var result = view.labelText();

          expect(result).to.eq('Rainbow Text');
        });
      });

      describe('with missing prefixed attribute translation', function() {
        support.useFakeTranslations({
          'activerecord.attributes.page.title': 'AR Text'
        });

        it('falls back to active record attribute translation', function() {
          var view = createInputView({
            attributeTranslationKeyPrefixes: [
              'pageflow.rainbows.page_attributes'
            ],
            model: {i18nKey: 'page'},
            propertyName: 'title'
          });

          var result = view.labelText();

          expect(result).to.eq('AR Text');
        });
      });
    });

    describe('without attributeTranslationKeyPrefixes', function() {
      support.useFakeTranslations({
        'activerecord.attributes.page.title': 'AR Text'
      });

      it('uses active record attribute translation', function() {
        var view = createInputView({
          model: {i18nKey: 'page'},
          propertyName: 'title'
        });

        var result = view.labelText();

        expect(result).to.eq('AR Text');
      });
    });
  });

  describe('#inlineHelpText', function() {
    describe('with attributeTranslationKeyPrefixes option', function() {
      describe('with present prefixed attribute translation', function() {
        support.useFakeTranslations({
          'pageflow.rainbows.page_attributes.title.inline_help': 'Rainbow Help',
          'pageflow.rainbows.page_attributes.title.inline_help_disabled': 'Rainbow Help Disabled',
          'pageflow.ui.inline_help.page.title': 'Model/Attribute Help'
        });

        it('uses prefixed inline help translation', function() {
          var view = createInputView({
            attributeTranslationKeyPrefixes: [
              'pageflow.rainbows.page_attributes'
            ],
            model: {i18nKey: 'page'},
            propertyName: 'title'
          });

          var result = view.inlineHelpText();

          expect(result).to.eq('Rainbow Help');
        });

        it('prefers prefixed inline help translation for disabled input', function() {
          var view = createInputView({
            attributeTranslationKeyPrefixes: [
              'pageflow.rainbows.page_attributes'
            ],
            model: {i18nKey: 'page'},
            propertyName: 'title',
            disabled: true
          });

          var result = view.inlineHelpText();

          expect(result).to.eq('Rainbow Help Disabled');
        });
      });

      describe('with multiple prefixed attribute translations', function() {
        support.useFakeTranslations({
          'pageflow.rainbows.page_attributes.title.inline_help': 'Rainbow Help',
          'pageflow.common_page_attributes.title.inline_help': 'Common Help',
          'pageflow.common_page_attributes.title.inline_help_disabled': 'Common Help Disabled',
          'pageflow.ui.inline_help.page.title': 'Model/Attribute Help'
        });

        it('prefers more specific inline help over disabled inline help', function() {
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

          expect(result).to.eq('Rainbow Help');
        });
      });

      describe('with missing prefixed attribute translation', function() {
        support.useFakeTranslations({
          'pageflow.ui.inline_help.page.title_html': '<strong>Model/Attribute Help</strong>'
        });

        it('falls back to model/attribute based inline help translation', function() {
          var view = createInputView({
            attributeTranslationKeyPrefixes: [
              'pageflow.rainbows.page_attributes'
            ],
            model: {i18nKey: 'page'},
            propertyName: 'title'
          });

          var result = view.inlineHelpText();

          expect(result).to.eq('<strong>Model/Attribute Help</strong>');
        });
      });
    });

    describe('without attributeTranslationKeyPrefixes', function() {
      support.useFakeTranslations({
        'pageflow.ui.inline_help.page.title': 'Model/Attribute Help',
        'pageflow.ui.inline_help.page.title_disabled': 'Model/Attribute Help Disabled'
      });

      it('uses model/attribute based inline help translation', function() {
        var view = createInputView({
          model: {i18nKey: 'page'},
          propertyName: 'title'
        });

        var result = view.inlineHelpText();

        expect(result).to.eq('Model/Attribute Help');
      });

      it('prefers disabled suffix if disabled', function() {
        var view = createInputView({
          model: {i18nKey: 'page'},
          propertyName: 'title',
          disabled: true
        });

        var result = view.inlineHelpText();

        expect(result).to.eq('Model/Attribute Help Disabled');
      });
    });
  });

  function createInputView(options) {
    var view = {options: options};
    view.model = options.model;
    _.extend(view, pageflow.inputView);

    return view;
  }
});
