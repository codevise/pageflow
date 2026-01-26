import {useMemo} from 'react';
import {useEntryStateCollectionItems} from './EntryStateProvider';

export function useWidget({role}) {
  const widgets = useEntryStateCollectionItems('widgets');

  return useMemo(
    () => widgets.find(widget => widget.role === role && widget.typeName),
    [role, widgets]
  );
}

export function useActiveWidgets() {
  const widgets = useEntryStateCollectionItems('widgets');

  return useMemo(
    () => widgets.filter(widget => widget.typeName),
    [widgets]
  );
}
