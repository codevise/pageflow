/**
 * Register new types of widgets.
 * @name frontend_widgetTypes
 */
export class WidgetTypeRegistry {
  constructor() {
    this.types = {};
  }

  /**
   * Register a new type of widget.
   *
   * @param {string} typeName - Name of the content element type.
   * @param {Object} options
   * @param {React.Component} options.component
   * @memberof frontend_widgetTypes
   *
   * @example
   *
   * // frontend.js
   *
   * import {frontend} from 'pageflow-scrolled/frontend';
   * import {CustomNavigationBar} from './CustomNavigationBar';
   *
   * frontend.contentElementTypes.register('customNavigationBar', {
   *   component: CustomNavigationBar
   * });
   */
  register(typeName, options) {
    if (!options.component) {
      throw new Error(`Missing required component option for widget type '${typeName}'.`)
    }

    this.types[typeName] = options;
  }

  getComponent(typeName) {
    if (!this.types[typeName]) {
      throw new Error(`Unknown widget type '${typeName}'. Consider calling frontent.widgetTypes.register.`);
    }

    return this.types[typeName].component;
  }
}
