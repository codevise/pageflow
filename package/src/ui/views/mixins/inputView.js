import _ from 'underscore';

import {attributeTranslationKeys, findTranslation, translationKeysWithSuffix} from '../../utils/i18nUtils';

/**
 * Mixin for input views handling common concerns like labels,
 * inline help, visiblity and disabling.
 *
 * ## Label and Inline Help Translations
 *
 * By default `#labelText` and `#inlineHelpText` are defined through
 * translations. If no `attributeTranslationKeyPrefixes` are given,
 * translation keys for labels and inline help are constructed from
 * the `i18nKey` of the model and the given `propertyName`
 * option. Suppose the model's `i18nKey` is "page" and the
 * `propertyName` option is "title". Then the key
 *
 *     activerecord.attributes.page.title
 *
 * will be used for the label. And the key
 *
 *     pageflow.ui.inline_help.page.title_html
 *     pageflow.ui.inline_help.page.title
 *
 * will be used for the inline help.
 *
 * ### Attribute Translation Key Prefixes
 *
 * The `attributeTranslationKeyPrefixes` option can be used to supply
 * an array of scopes in which label and inline help translations
 * shall be looked up based on the `propertyName` option.
 *
 * Suppose the array `['some.attributes', 'fallback.attributes']` is
 * given as `attributeTranslationKeyPrefixes` option. Then, in the
 * example above, the first existing translation key is used as label:
 *
 *     some.attributes.title.label
 *     fallback.attributes.title.label
 *     activerecord.attributes.post.title
 *
 * Accordingly, for the inline help:
 *
 *     some.attributes.title.inline_help_html
 *     some.attributes.title.inline_help
 *     fallback.attributes.title.inline_help_html
 *     fallback.attributes.title.inline_help
 *     pageflow.ui.inline_help.post.title_html
 *     pageflow.ui.inline_help.post.title
 *
 * This setup allows to keep all translation keys for an attribute
 * to share a common prefix:
 *
 *     some:
 *       attributes:
 *         title:
 *           label: "Label"
 *           inline_help: "..."
 *           inline_help_disabled: "..."
 *
 * ### Inline Help for Disabled Inputs
 *
 * For each inline help translation key, a separate key with an
 * `"_disabled"` suffix can be supplied, which provides a help string
 * that shall be displayed when the input is disabled. More specific
 * attribute translation key prefixes take precedence over suffixed
 * keys:
 *
 *     some.attributes.title.inline_help_html
 *     some.attributes.title.inline_help
 *     some.attributes.title.inline_help_disabled_html
 *     some.attributes.title.inline_help_disabled
 *     fallback.attributes.title.inline_help_html
 *     fallback.attributes.title.inline_help
 *     fallback.attributes.title.inline_help_disabled_html
 *     fallback.attributes.title.inline_help_disabled
 *     pageflow.ui.inline_help.post.title_html
 *     pageflow.ui.inline_help.post.title
 *     pageflow.ui.inline_help.post.title_disabled_html
 *     pageflow.ui.inline_help.post.title_disabled
 *
 * @param {string} options
 *   Common constructor options for all views that include this mixin.
 *
 * @param {string} options.propertyName
 *   Name of the attribute on the model to display and edit.
 *
 * @param {string} [options.label]
 *   Label text for the input.
 *
 * @param {string[]} [options.attributeTranslationKeyPrefixes]
 *   An array of prefixes to lookup translations for labels and
 *   inline help texts based on attribute names.
 *
 * @param {string} [options.additionalInlineHelpText]
 *   A text that will be appended to the translation based inline
 *   text.
 *
 * @param {boolean} [options.disabled]
 *   Render input as disabled.
 *
 * @param {string} [options.visibleBinding]
 *   Name of an attribute to control whether the input is visible. If
 *   the `visible` and `visibleBindingValue` options are not set,
 *   input will be visible whenever this attribute has a truthy value.
 *
 * @param {function|boolean} [options.visible]
 *   A Function taking the value of the `visibleBinding` attribute as
 *   parameter. Input will be visible only if function returns `true`.
 *
 * @param {any} [options.visibleBindingValue]
 *   Input will be visible whenever the value of the `visibleBinding`
 *   attribute equals the value of this option.
 *
 * @mixin
 */
export const inputView = {
  ui: {
    label: 'label',
    labelText: 'label .name',
    inlineHelp: 'label .inline_help'
  },

  /**
   * Returns an array of translation keys based on the
   * `attributeTranslationKeyPrefixes` option and the given keyName.
   *
   * Combined with {@link #i18nutils
   * i18nUtils.findTranslation}, this can be used inside input views
   * to obtain additional translations with the same logic as for
   * labels and inline help texts.
   *
   * findTranslation(this.attributeTranslationKeys('default_value'));
   *
   * @param {string} keyName
   * Suffix to append to prefixes.
   *
   * @param {string} [options.fallbackPrefix]
   *   Optional additional prefix to form a model based translation
   *   key of the form `prefix.modelI18nKey.propertyName.keyName
   *
   * @return {string[]}
   * @since 0.9
   * @member
   */
  attributeTranslationKeys: function(keyName, options) {
    return attributeTranslationKeys(
      this.options.propertyName,
      keyName,
      _.extend({
        prefixes: this.options.attributeTranslationKeyPrefixes,
        fallbackModelI18nKey: this.model.i18nKey
      }, options || {})
    );
  },

  onRender: function() {
    this.$el.addClass('input');
    this.$el.addClass(this.model.modelName + '_' + this.options.propertyName);

    this.$el.data('inputPropertyName', this.options.propertyName);
    this.$el.data('labelText', this.labelText());
    this.$el.data('inlineHelpText', this.inlineHelpText());

    this.ui.labelText.text(this.labelText());
    this.ui.inlineHelp.html(this.inlineHelpText());

    if (!this.inlineHelpText()) {
      this.ui.inlineHelp.hide();
    }

    this.setLabelFor();
    this.updateDisabled();
    this.setupVisibleBinding();
  },

  /**
   * The label to display in the form.
   * @return {string}
   */
  labelText: function() {
    return this.options.label || this.localizedAttributeName();
  },

  localizedAttributeName: function() {
    return findTranslation(this.attributeTranslationKeys('label', {
      fallbackPrefix: 'activerecord.attributes'
    }));
  },

  /**
   * The inline help text for the form field.
   * @return {string}
   */
  inlineHelpText: function() {
    var keys = this.attributeTranslationKeys('inline_help', {
      fallbackPrefix: 'pageflow.ui.inline_help'
    });

    if (this.options.disabled) {
      keys = translationKeysWithSuffix(keys, 'disabled');
    }

    return _.compact([
      findTranslation(keys, {defaultValue: '', html: true}),
      this.options.additionalInlineHelpText
    ]).join(' ');
  },

  setLabelFor() {
    if (this.ui.input &&
        this.ui.label.length === 1 &&
        !this.ui.input.attr('id')) {
      const id = 'input_' + this.model.modelName + '_' + this.options.propertyName

      this.ui.input.attr('id', id);
      this.ui.label.attr('for', id);
    }
  },

  updateDisabled: function() {
    if (this.ui.input) {
      this.updateDisabledAttribute(this.ui.input);
    }
  },

  updateDisabledAttribute: function(element) {
    if (this.options.disabled) {
      element.attr('disabled', true);
    }
    else {
      element.removeAttr('disabled');
    }
  },

  setupVisibleBinding: function() {
    var view = this;

    if (this.options.visibleBinding) {
      this.listenTo(this.model, 'change:' + this.options.visibleBinding, updateVisible);
      updateVisible(this.model, this.model.get(this.options.visibleBinding));
    }

    function updateVisible(model, value) {
      view.$el.toggleClass('input-hidden_via_binding', !isVisible(value));
    }

    function isVisible(value) {
      if ('visibleBindingValue' in view.options) {
        return value === view.options.visibleBindingValue;
      }
      else if (typeof view.options.visible === 'function') {
        return !!view.options.visible(value);
      }
      else if ('visible' in view.options) {
        return !!view.options.visible;
      }
      else {
        return !!value;
      }
    }
  }
};
