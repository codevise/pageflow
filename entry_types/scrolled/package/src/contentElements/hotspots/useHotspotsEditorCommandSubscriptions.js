import {
  useContentElementEditorCommandSubscription,
} from 'pageflow-scrolled/frontend';

export function useHotspotsEditorCommandSubscriptions({setHighlightedIndex, activateArea}) {
  useContentElementEditorCommandSubscription(command => {
    if (command.type === 'HIGHLIGHT_AREA') {
      setHighlightedIndex(command.index);
    }
    else if (command.type === 'RESET_AREA_HIGHLIGHT') {
      setHighlightedIndex(-1);
    }
    else if (command.type === 'SET_ACTIVE_AREA') {
      activateArea(command.index);
    }
  });
}
