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
   * @param {Object} options.defaultConfig -
   *   Object that is set as initial config for the content element.
   * @param {Function} [options.split] -
   *   Function that receives configuration attributes and a split point
   *   and needs to return a two element array of configuration attributes
   *   objects representing the content elements that arise from splitting
   *   a content element with the given configuration at the specified
   *   split point. Called when inserting content elements at custom split
   *   points.
   * @param {Function} [options.merge] -
   *   Function that receives two configuration attributes objects and
   *   needs to return a single merged configuration. If provided, this
   *   will function will be called whenever two content elements of this
   *   type become adjacent because a common neighbor has been deleted.
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

  setupConfigurationEditor(typeName, configurationEditorView, options) {
    return this.findByTypeName(typeName).configurationEditor.call(configurationEditorView, options);
  }

  findByTypeName(typeName) {
    if (!this.contentElementTypes[typeName]) {
      throw new Error(`Unknown content element type ${typeName}`);
    }

    return this.contentElementTypes[typeName];
  }

  toArray() {
    return Object.keys(this.contentElementTypes).map(typeName => ({
      typeName,
      displayName: I18n.t(`pageflow_scrolled.editor.content_elements.${typeName}.name`)
    }));
  }
}
