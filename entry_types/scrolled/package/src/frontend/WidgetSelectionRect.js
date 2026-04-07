import {extensible} from './extensions';

export const WidgetSelectionRect = extensible(
  'WidgetSelectionRect',
  function WidgetSelectionRect({children}) {
    return children;
  }
);
