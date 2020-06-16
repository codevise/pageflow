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
   *   `sticky`, `full` and `inline`. When inserting a content element
   *   next to a `sticky`, `left` or `right` positioned sibling, only
   *   types supporting this position will be offered in the type
   *   selection dialog. By default all positions are supported.
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

  getSupported(entry, insertOptions) {
    const [sibling, otherSibling] = getSiblings(entry, insertOptions);
    const position = sibling ? sibling.getDefaultSiblingPosition() : 'inline';

    return this.toArray().filter(type => {
      if (type.supportedPositions && !type.supportedPositions.includes(position)) {
        return false;
      }

      if (canBeMerged(type, sibling) || canBeMerged(type, otherSibling)) {
        return false;
      }

      return true;
    });
  }

  toArray() {
    return Object.keys(this.contentElementTypes).map(typeName => ({
      ...this.contentElementTypes[typeName],
      typeName,
      displayName: I18n.t(`pageflow_scrolled.editor.content_elements.${typeName}.name`)
    }));
  }
}

function getSiblings(entry, insertOptions) {
  if (insertOptions.at === 'endOfSection') {
    return [undefined, entry.sections.get(insertOptions.id).contentElements.last()];
  }

  const sibling = entry.contentElements.get(insertOptions.id);
  const otherSibling = getOtherSibling(sibling, insertOptions);

  return [sibling, otherSibling];
}

function canBeMerged(type, sibling) {
  return type.merge && sibling && sibling.get('typeName') === type.typeName;
}

function getOtherSibling(sibling, insertOptions) {
  const [before, after] = sibling.getAdjacentContentElements();

  if (insertOptions.at === 'before') {
    return before;
  }
  else if (insertOptions.at === 'after') {
    return after;
  }
}
