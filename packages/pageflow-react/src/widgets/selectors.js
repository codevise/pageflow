import {createItemSelector} from 'collections';

import {memoizedSelector} from 'utils';

const selector = createItemSelector('widgets');

export function widgetAttribute(property, {role}) {
  return memoizedSelector(
    selector({id: role}),
    widget => widget && widget[property]
  );
}

export function widgetAttributes({role}) {
  return memoizedSelector(
    selector({id: role}),
    widget => widget
  );
}

export function editingWidget({role}) {
  return memoizedSelector(
    selector({id: role}),
    widget => !!(widget && widget.editing)
  );
}
