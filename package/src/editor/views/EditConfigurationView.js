import Backbone from 'backbone';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {DropDownButtonView} from './DropDownButtonView';
import {failureIndicatingView} from './mixins/failureIndicatingView';
import {ConfigurationEditorView} from 'pageflow/ui';
import {editor} from '../base';

/**
 * Base view to edit configuration container models.  Extend and
 * override the `configure` method which receives a {@link
 * ConfigurationEditorView} to define the tabs and inputs that shall
 * be displayed.
 *
 * Add a `translationKeyPrefix` property to the prototype and define
 * the following translations:
 *
 * * `<translationKeyPrefix>.tabs`: used as `tabTranslationKeyPrefix`
 *   of the `ConfigurationEditorView`.
 *
 * * `<translationKeyPrefix>.attributes`: used as one of the
 *   `attributeTranslationKeyPrefixes` of the
 *   `ConfigurationEditorView`.
 *
 * * `<translationKeyPrefix>.back` (optional): Back button label.
 *
 * * `<translationKeyPrefix>.save_error` (optional): Header of the
 *   failure message that is displayed if the model cannot be saved.
 *
 * * `<translationKeyPrefix>.retry` (optional): Label of the retry
 *   button of the failure message.
 *
 * Override the `goBackPath` property or method to customize the path
 * that the back button navigates to. Defaults to `/`.
 *
 * Override the `defaultTab` property or method to set the initially
 * selected tab.
 *
 * Override the `getActionsMenuItems` method to add menu items to the
 * actions dropdown.
 *
 * @param {Object} options
 * @param {Backbone.Model} options.model -
 *   Model including the {@link configurationContainer} and
 *   {@link failureTracking} mixins.
 *
 * @since 15.1
 */
export const EditConfigurationView = Marionette.Layout.extend({
  className: 'edit_configuration_view',

  template: ({t, backLabel}) => `
    <a class="back">${backLabel}</a>
    <div class="actions_drop_down_button"></div>

    <div class="failure">
      <p>${t('save_error')}</p>
      <p class="message"></p>
      <a class="retry" href="">${t('retry')}</a>
    </div>

    <div class="configuration_container"></div>
  `,

  serializeData() {
    return {
      t: key => this.t(key),
      backLabel: this.getBackLabel()
    };
  },

  mixins: [failureIndicatingView],

  regions: {
    configurationContainer: '.configuration_container'
  },

  events: {
    'click a.back': 'goBack'
  },

  destroyEvent: 'destroy',

  initialize() {
    this.listenTo(this.model, _.result(this, 'destroyEvent'), this.goBack);
  },

  onRender: function() {
    const translationKeyPrefix = _.result(this, 'translationKeyPrefix');

    this.configurationEditor = new ConfigurationEditorView({
      tabTranslationKeyPrefix: `${translationKeyPrefix}.tabs`,
      attributeTranslationKeyPrefixes: [`${translationKeyPrefix}.attributes`],
      model: this.getConfigurationModel(),
      tab: _.result(this, 'defaultTab')
    });

    this.configure(this.configurationEditor);
    this.configurationContainer.show(this.configurationEditor);

    this.renderActionsDropDown();
  },

  renderActionsDropDown() {
    const items = new Backbone.Collection(this.getActionsMenuItems());

    if (!items.length) {
      return;
    }

    this.$el.find('.actions_drop_down_button').append(
      this.subview(new DropDownButtonView({
        items,
        label: this.t('actions'),
        ellipsisIcon: true,
        openOnClick: true,
        alignMenu: 'right'
      })).el
    );
  },

  getActionsMenuItems() {
    return [];
  },

  onShow: function() {
    this.configurationEditor.refreshScroller();
  },

  goBack: function() {
    const path = _.result(this, 'goBackPath') || '/';
    editor.navigate(path, {trigger: true});
  },

  getConfigurationModel() {
    return this.model.configuration;
  },

  getBackLabel() {
    return this.t(_.result(this, 'goBackPath') ? 'back' : 'outline');
  },

  t(suffix) {
    const translationKeyPrefix = _.result(this, 'translationKeyPrefix');

    return I18n.t(`${translationKeyPrefix}.${suffix}`, {
      defaultValue: I18n.t(`pageflow.editor.views.edit_configuration.${suffix}`)
    });
  }
});
