/**
 * Register new types of content elements.
 * @name frontend_contentElementTypes
 */
export class ContentElementTypeRegistry {
  constructor() {
    this.types = {};
  }

  /**
   * Register a new type of content element.
   *
   * @param {string} typeName - Name of the content element type.
   * @param {Object} options
   * @param {React.Component} options.component
   * @param {boolean} [options.supportsWrappingAroundFloats] -
   *   In sections with centered layout, content elements can be
   *   floated to the left or right. By default all content
   *   elements are cleared to position them below floating
   *   elements. If a content element renders mainly text that
   *   can wrap around floating elements, clearing can be
   *   disabled via this option.
   * @memberof frontend_contentElementTypes
   *
   * @example
   *
   * // frontend.js
   *
   * import {frontend} from 'pageflow-scrolled/frontend';
   * import {InlineImage} from './InlineImage';
   *
   * frontend.contentElementTypes.register('inlineImage', {
   *   component: InlineImage
   * });
   */
  register(typeName, options) {
    this.types[typeName] = options;
  }

  getComponent(typeName) {
    return this.types[typeName] && this.types[typeName].component;
  }

  getOptions(typeName) {
    return this.types[typeName];
  }
}
