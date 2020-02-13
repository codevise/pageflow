import I18n from 'i18n-js'

/**
 * Integrate new content types into the editor.
 * @name editor_contentElementTypes
 */
export class ContentElementTypeRegistry {
  constructor() {
    this.contentElementTypes = {};
  }

  /**
   * Register a new type of content element in the editor.
   *
   * @param {string} typeName - Name of the content element type.
   * @param {Object} options
   * @param {Function} options.configurationEditor -
   *   Function that is evaluated in the context of a
   *   `ConfigurationEditorView` (see `pageflow/ui`) which will
   *   be used to edit the configuration of content elements of
   *   this type.
   * @memberof editor_contentElementTypes
   *
   * @example
   *
   * // editor.js
   * editor.contentElementTypes.register('inlineImage', {
   *   configurationEditor() {
   *     this.tab('general', function() {
   *       this.input('caption', TextInputView);
   *     });
   *   }
   * });
   */
  register(typeName, options) {
    this.contentElementTypes[typeName] = options;
  }

  setupConfigurationEditor(name, configurationEditorView, options) {
    if (!this.contentElementTypes[name]) {
      throw new Error(`Unknown content element type ${name}`);
    }

    return this.contentElementTypes[name].configurationEditor.call(configurationEditorView, options);
  }

  toArray() {
    return Object.keys(this.contentElementTypes).map(typeName => ({
      typeName,
      displayName: I18n.t(`pageflow_scrolled.editor.content_elements.${typeName}.name`)
    }));
  }
}
