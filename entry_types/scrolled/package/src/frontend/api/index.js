import {ContentElementTypeRegistry} from './ContentElementTypeRegistry';
import {WidgetTypeRegistry} from './WidgetTypeRegistry';

export const api = {
  contentElementTypes: new ContentElementTypeRegistry(),

  widgetTypes: new WidgetTypeRegistry(),

  /**
   * Custom error boundary component to wrap content elements.
   * Allows integration with error monitoring tools. The component receives
   * typeName (string), configuration (object), fallback (function returning
   * default UI), and children (content element).
   *
   * @property {React.Component} contentElementErrorBoundary
   */
  contentElementErrorBoundary: undefined
}
