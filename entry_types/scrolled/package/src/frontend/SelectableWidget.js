import {withInlineEditingDecorator} from './inlineEditing';

import {Widget} from './Widget'

export const SelectableWidget = withInlineEditingDecorator(
  'SelectableWidgetDecorator',
  Widget
);
