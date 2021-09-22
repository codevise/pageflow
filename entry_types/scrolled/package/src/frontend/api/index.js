import {ContentElementTypeRegistry} from './ContentElementTypeRegistry';
import {WidgetTypeRegistry} from './WidgetTypeRegistry';

export const api = {
  contentElementTypes: new ContentElementTypeRegistry(),

  widgetTypes: new WidgetTypeRegistry()
}
