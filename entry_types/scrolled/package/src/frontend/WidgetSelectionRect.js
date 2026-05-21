import {extensible} from './extensionRegistry';

export const WidgetSelectionRect = extensible(
  'WidgetSelectionRect',
  function WidgetSelectionRect({children}) {
    return children;
  }
);
