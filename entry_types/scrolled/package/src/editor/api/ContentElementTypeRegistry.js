import I18n from 'i18n-js'

/**
 * Integrate new content types into the editor.
 * @name editor_contentElementTypes
 */
export class ContentElementTypeRegistry {
  constructor({features}) {
    this.features = features;
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
   *   this type. Receives an options object with an `entry`
   *   property containing the entry model.
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
   * @param {string[]} [options.supportedPositions] -
   *   Pass array containing a subset of the positions `left`, `right`,
   *   `sticky` and `inline`. By default all positions are supported.
   * @param {string[]} [options.supportedWidthRange] -
   *   Pass array consisting of two widths of the form `xxs`, `xs`, `sm`,
   *   `md`, `lg`, `xl` or `full` representing the smallest andlargest
   *   supported width. By default only width `md` is supported.
   * @memberof editor_contentElementTypes
   *
   * @example
   *
   * // editor.js
   * editor.contentElementTypes.register('inlineImage', {
   *   supportedWidthRange: ['xss', 'full'],
   *
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

  groupedByCategory() {
    const result = [];
    const categoriesByName = {};

    this.toArray().forEach(contentElementType => {
      const categoryName = contentElementType.category || 'basic';

      if (!categoriesByName[categoryName]) {
        categoriesByName[categoryName] = {
          name: categoryName,
          displayName: I18n.t(
            `pageflow_scrolled.editor.content_element_categories.${categoryName}.name`
          ),
          contentElementTypes: []
        };

        result.push(categoriesByName[categoryName]);
      }

      categoriesByName[categoryName].contentElementTypes.push(contentElementType);
    });

    return result;
  }

  toArray() {
    return Object
      .keys(this.contentElementTypes)
      .map(typeName => ({
        ...this.contentElementTypes[typeName],
        typeName,
        displayName: I18n.t(`pageflow_scrolled.editor.content_elements.${typeName}.name`),
        description: I18n.t(
          `pageflow_scrolled.editor.content_elements.${typeName}.description`
        )
      }))
      .filter(contentElement =>
        !contentElement.featureName || this.features.isEnabled(contentElement.featureName)
      );
  }
}
