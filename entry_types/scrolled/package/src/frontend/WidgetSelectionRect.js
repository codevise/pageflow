import {withInlineEditingAlternative} from './inlineEditing';

export const WidgetSelectionRect = withInlineEditingAlternative(
  'WidgetSelectionRect',
  function WidgetSelectionRect({children}) {
    return children;
  }
);
