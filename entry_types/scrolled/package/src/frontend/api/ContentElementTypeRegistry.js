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
    if (!this.types[typeName]) {
      throw new Error(`Unknown content element type name "${typeName}"`);
    }

    return this.types[typeName].component;
  }
}
